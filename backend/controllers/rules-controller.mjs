import pool from "../db.mjs";

class RulesController {
    async createRule(req, res) {
        try{
            const { rulename, description } = req.body;
            const newRule = await pool.query(`INSERT INTO rules (ruleid, rulename, description, type) VALUES ($1, $2, $3, $4) RETURNING *`, [1, rulename, description, 'Short']);
            res.json(newRule.rows[0]);
        } catch(e){
            console.error('Error creating a rule:', e);
            res.status(500).json({ message: 'An error occurred' });
        }
    }

    async getAllRules(req, res) {
        try{
            const users = await pool.query(`SELECT * FROM rules`);
            res.json(users.rows);
        } catch(e){
            console.error('Error getting rules:', e);
            res.status(500).json({ message: 'An error occurred' });
        }
    }

    async getAllRulesForCat(req, res) {
        try{
            const cat = req.params.cat;
            const results = await pool.query(`SELECT * FROM rules WHERE type = '${cat}'`);
            res.json(results.rows)
        } catch(e){
            console.error('Error getting rules:', e);
            res.status(500).json({ message: 'An error occurred' });
        }
    }

    async changeStatus(req, res) {
        try {
            const id = req.params.id; 
            const query = `
                UPDATE rules
                SET status = CASE WHEN status = true THEN false ELSE true END
                WHERE ruleid = $1
                RETURNING *
            `;
    
            const result = await pool.query(query, [id]);
    
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Rule not found' });
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
    }
    
    
}

export default new RulesController();
