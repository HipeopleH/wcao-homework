import sql from "../lib/db.js";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { id } = req.query;


        if (!id || !/^\d{6}$/.test(id)) {
            return res.status(400).json({
                error: "Invalid assignment ID."
            });
        }


        const rows = await sql`
            SELECT
                id,
                title,
                type,
                viewer,
                content,
                created_at
            FROM assignments
            WHERE id = ${id}
            LIMIT 1
        `;


        if (rows.length === 0) {
            return res.status(404).json({
                error: "Assignment not found."
            });
        }


        const assignment = rows[0];


        return res.status(200).json({
            success: true,
            document: {
                id: assignment.id,
                title: assignment.title,
                type: assignment.type,
                viewer: assignment.viewer,
                content: assignment.content,
                createdAt: assignment.created_at
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Failed to load assignment."
        });

    }

}
