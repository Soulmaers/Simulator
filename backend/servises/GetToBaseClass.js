
const { connection } = require('../dbConfig')

class GetToBaseClass {



    static async getModel(id) {
        const post = `SELECT nameCar, osi, trailer, tyres FROM model WHERE idw=@id`
        try {
            const pool = await connection
            const result = await pool.request()
                .input('id', id)
                .query(post)
            return result.recordset.length === 0 ? null : result.recordset
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    static async getTyres(id) {
        const post = `SELECT tyresDiv,pressure, temp, osNumber FROM tyres WHERE idw=@id`
        try {
            const pool = await connection
            const result = await pool.request()
                .input('id', id)
                .query(post)
            return result.recordset.length === 0 ? null : result.recordset
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    static async getParametrs(id) {
        const post = `SELECT * FROM sens_stor_meta WHERE idw=@id`
        try {
            const pool = await connection
            const result = await pool.request()
                .input('id', id)
                .query(post)
            return result.recordset.length === 0 ? null : result.recordset
        }
        catch (e) {
            console.log(e)
            return null
        }
    }

    static async getParams(id, time, params) {
        console.log(time)
        const value = params.filter(e => e !== null)
        const selectedTColumnsTest = value.join(", ")
        const post = `
            SELECT ${selectedTColumnsTest}
            FROM globalStor
            WHERE idw=@idw AND last_valid_time >= @time1 AND last_valid_time <= @time2
        `;
        try {
            const pool = await connection;
            const result = await pool.request()
                .input('idw', String(id))
                .input('time2', String(time[1]))
                .input('time1', String(time[0]))
                .query(post);
            return result.recordset.length === 0 ? null : result.recordset
        }


        catch (e) {
            console.error(e);
            return [];
        }
    }
}

module.exports = GetToBaseClass