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


    // Controllers to get signals by the rule
    async getSignalsForRule(req, res){
        try{
            const ruleName = req.params.name;
            const query = `
            SELECT signalid, tradingpair, timeframe, rule, data, to_char(timestamp, 'YYYY-MM-DD HH24:MI:SSOF') AS timestamp
            FROM public.signals
            WHERE rule = $1
            ORDER BY timestamp DESC
            LIMIT 100
            `
            const result = await pool.query(query, [ruleName]);

            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: 'Rule not found' });
            }
        } catch (error) {
            console.error('Error getting signals:', error);
            res.status(500).json({ message: 'An error occurred retrieving the data' });
        }
    }
    

    async getTrendsByTimeframe(req, res){
        try{
            const timeframe = req.params.timeframe;
            const query = `
            SELECT trendid, longs, shorts, to_char(timestamp, 'YYYY-MM-DD HH24:MI:SSOF') AS timestamp,
                timeframe, candle_num, candle_color, rlong, along, blong, bfly, rshort, ashort, bshort, 
                gfly, total_long, total_short, data
            FROM public.trends
            WHERE timeframe = $1
            ORDER BY timestamp DESC
            LIMIT 100
            `
            const result = await pool.query(query, [timeframe]);

            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } catch (error) {
            console.error('Error getting trends:', error);
            res.status(500).json({ message: 'An error occurred retrieving the data' });
        }
    }

    async getSignalsForTrends(req, res) {
        try {
            const {ids} = req.body;
            const query = `SELECT * FROM signals	
            WHERE signalid in (${ids.join(',')})
            order by signalid`;

            const result = await pool.query(query);
            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } catch (error) {
            console.error('Error getting connections:', error);
            res.status(500).json({ message: 'An error occurred retrieving the data' });
        }
    }

    async getConnections(req, res){
        try{
            const timeframe = req.params.timeframe;
            const type = req.params.type;
            const query = `
            SELECT connectid, tradingpair, data, 
                to_char(timestamp, 'YYYY-MM-DD HH24:MI:SSOF') AS timestamp
            FROM public.connections
            WHERE timeframe = $1
            AND type = $2
            ORDER BY timestamp DESC
            LIMIT 100
            `
            const result = await pool.query(query, [timeframe, type]);

            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } catch (error) {
            console.error('Error getting connections:', error);
            res.status(500).json({ message: 'An error occurred retrieving the data' });
        }
    }

    async getTradingPairs(req, res){
        try{
            const query = `
            SELECT * FROM public.tradingpairs
            ORDER BY tradingpairid ASC 
            `
            const result = await pool.query(query);

            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        } catch (error) {
            console.error('Error getting trading pairs:', error);
            res.status(500).json({ message: 'An error occurred retrieving the data' });
        }
    }
    
}

export default new RulesController();
