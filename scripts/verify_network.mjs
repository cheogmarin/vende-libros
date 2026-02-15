
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            if (key && value) {
                env[key] = value;
            }
        }
    });
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MATRIX_WIDTH = 3;

// Mock function implementation
const findSpilloverPlacement = async (sponsorId) => {
    console.log(`Checking placement for sponsor: ${sponsorId}`);
    // 1. Check if sponsor has space
    const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('parent_id', sponsorId);

    if (error) {
        console.error('Error checking sponsor children:', error);
        return null;
    }

    // console.log(`Direct children count: ${count}`);

    if (count !== null && count < MATRIX_WIDTH) {
        return sponsorId; // Sponsor has space!
    }

    // 2. BFS Implementation
    let queue = [sponsorId];

    while (queue.length > 0) {
        const currentLevelIds = queue; // Process level by level
        queue = []; // Reset for next level

        console.log(`Checking level with ${currentLevelIds.length} nodes...`);

        // Fetch all children of the current level
        const { data: children, error: childrenError } = await supabase
            .from('profiles')
            .select('id, parent_id')
            .in('parent_id', currentLevelIds);

        if (childrenError) {
            console.error('Error fetching matrix level:', childrenError);
            return null;
        }

        // Group children by parent
        const childrenMap = new Map();
        const childrenIds = [];

        // Initialize counts
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
            const count = childrenMap.get(parentId) || 0;
            if (count < MATRIX_WIDTH) {
                console.log(`Found slot under: ${parentId} (has ${count} children)`);
                return parentId; // Found a slot!
            }
        }

        // If no space, add children to queue
        children?.forEach(child => {
            childrenIds.push(child.id);
        });
        // This sorting is pseudo-random unless we query order by created_at.
        // For verification purposes, we just want *some* valid slot.
        queue.push(...childrenIds);

        if (queue.length > 500) {
            console.warn('Matrix BFS limit reached (safety break)');
            return null;
        }
    }

    return sponsorId;
};

// Main execution
(async () => {
    try {
        console.log('Connecting to Supabase...');
        // Get the root user or first user to test
        const { data: users, error } = await supabase.from('profiles').select('id, username').limit(1);

        if (error) {
            console.error("Error fetching users:", error);
            if (error.code === '42703') { // Undefined column
                console.error("Hint: Did you run the migration to add 'parent_id' column?");
            }
            return;
        }

        if (!users || users.length === 0) {
            console.log("No users found in database to test with. (Make sure you are registered!)");
            return;
        }

        const rootUser = users[0];
        console.log(`Testing spillover logic starting from user: ${rootUser.username} (${rootUser.id})`);

        const placement = await findSpilloverPlacement(rootUser.id);

        if (placement) {
            console.log(`\n>>> SUCCESS: Next user would be placed under: ${placement}`);
            if (placement === rootUser.id) {
                console.log("(This is correct if the root user has less than 3 referrals)");
            } else {
                console.log("(This is correct if the root user is full)");
            }
        } else {
            console.log("\n>>> FAILED: Could not determine placement.");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
})();
