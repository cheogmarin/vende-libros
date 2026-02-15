
import { supabase } from '../../supabase';
import { UserLevel } from '../../types';

interface NetworkNode {
    id: string;
    sponsor_id: string;
    parent_id: string | null;
    level: UserLevel;
    children_count?: number;
}

// MAX_WIDTH for a 3xN matrix is 3
const MATRIX_WIDTH = 3;

/**
 * Finds the first available slot in the sponsor's downline (Spillover).
 * Uses BFS (Breadth-First Search) to find the first node with < 3 children.
 */
export const findSpilloverPlacement = async (sponsorId: string): Promise<string | null> => {
    // 1. Check if sponsor has space
    const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('parent_id', sponsorId);

    if (error) {
        console.error('Error checking sponsor children:', error);
        return null;
    }

    if (count !== null && count < MATRIX_WIDTH) {
        return sponsorId; // Sponsor has space!
    }

    // 2. BFS Implementation
    // Since Supabase doesn't support recursive BFS easily without functions,
    // we'll implement a client-side BFS with batched queries.
    // Warning: This can be heavy for huge networks, but fine for this scale.

    let queue: string[] = [sponsorId];

    while (queue.length > 0) {
        const currentLevelIds = queue; // Process level by level
        queue = []; // Reset for next level

        // Fetch all children of the current level
        // We need to know WHICH parent they belong to, to count them.
        const { data: children, error: childrenError } = await supabase
            .from('profiles')
            .select('id, parent_id')
            .in('parent_id', currentLevelIds);

        if (childrenError) {
            console.error('Error fetching matrix level:', childrenError);
            return null;
        }

        // Group children by parent
        const childrenMap = new Map<string, number>();
        const childrenIds: string[] = [];

        // Initialize counts for all potential parents in this level
        currentLevelIds.forEach(id => childrenMap.set(id, 0));

        // Count actual children
        children?.forEach(child => {
            if (child.parent_id) {
                childrenMap.set(child.parent_id, (childrenMap.get(child.parent_id) || 0) + 1);
                childrenIds.push(child.id);
            }
        });

        // Check for the first one with space
        for (const parentId of currentLevelIds) {
            if ((childrenMap.get(parentId) || 0) < MATRIX_WIDTH) {
                return parentId; // Found a slot!
            }
        }

        // If no space in this level, add all children to queue for next level
        // We sort by creation time (implicitly by ID usually) to ensure filling left-to-right
        // Note: To strictly ensure left-to-right, we should order the `children` query by created_at.
        // For now, we rely on the order returned or could sort `childrenIds`.
        queue.push(...childrenIds);

        // Safety break to prevent infinite loops in weird states
        if (queue.length > 1000) {
            console.warn('Matrix BFS limit reached, defaulting to sponsor (fallback)');
            return sponsorId;
        }
    }

    return sponsorId; // Fallback
};

/**
 * Traverses up the tree to find the qualified beneficiary for a specific level payment.
 * Dynamic Compression: Skips users who are not active/qualified for that level.
 */
export const getCommissionBeneficiary = async (
    startNodeId: string,
    targetLevel: UserLevel
): Promise<string | null> => {
    // Define how many levels up we need to go ideally
    let levelsUp = 0;
    if (targetLevel === UserLevel.SEMILLA) levelsUp = 1;      // $2 -> Parent
    if (targetLevel === UserLevel.CRECIMIENTO) levelsUp = 2;  // $6 -> Grandparent
    if (targetLevel === UserLevel.COSECHA) levelsUp = 3;      // $20 -> Great-Grandparent

    let currentId = startNodeId;
    let stepsTaken = 0;

    // We loop until we find a qualified user or reach the top
    while (stepsTaken < levelsUp) {
        // Get parent
        const { data: user, error } = await supabase
            .from('profiles')
            .select('parent_id')
            .eq('id', currentId)
            .single();

        if (error || !user?.parent_id) return null; // Orphan or root

        currentId = user.parent_id;
        stepsTaken++;
    }

    // Now 'currentId' is the ideal beneficiary (e.g. Great-Grandparent).
    // We must check if they are qualified. IF NOT, we keep going UP (Compression).

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { data: candidate, error } = await supabase
            .from('profiles')
            .select('id, level, parent_id, email')
            .eq('id', currentId)
            .single();

        if (error || !candidate) return null; // Should not happen unless database inconsistency

        // Check logic:
        // 1. Root user always qualifies
        if (candidate.email === 'josegmarin2012@gmail.com') return candidate.id;

        // 2. Check strict level requirements
        // To receive Level 1 ($2), must be at least Level 1
        // To receive Level 2 ($6), must be at least Level 2 (CRECIMIENTO)
        // To receive Level 3 ($20), must be at least Level 3 (COSECHA)

        const candidateLevelNum = getLevelNumeric(candidate.level);
        const requiredLevelNum = getLevelNumeric(targetLevel); // Actually, usually you need to be AT LEAST the level of the product being sold.

        // Rule: You can receive payments for a level if you have unlocked that level yourself.
        if (candidateLevelNum >= requiredLevelNum) {
            return candidate.id;
        }

        // Compression: Candidate not qualified. Move to THEIR parent.
        if (!candidate.parent_id) return null; // Reached top without luck
        currentId = candidate.parent_id;
    }
};

const getLevelNumeric = (level: string): number => {
    if (level === 'SEMILLA') return 1;
    if (level === 'CRECIMIENTO') return 2;
    if (level === 'COSECHA') return 3;
    return 0; // GUEST
};
