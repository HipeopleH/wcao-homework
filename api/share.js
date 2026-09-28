import sql from "../lib/db.js";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            title,
            type,
            viewer,
            content
        } = req.body || {};


        if (!title || !type || !viewer || !content) {
            return res.status(400).json({
                error: "Missing assignment data."
            });
        }


        let id;

        while (true) {

            id = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            const existing =
                await sql`
                    SELECT id
                    FROM assignments
                    WHERE id = ${id}
                    LIMIT 1
                `;

            if (existing.length === 0) {
                break;
            }

        }


        await sql`
            INSERT INTO assignments (
                id,
                title,
                type,
                viewer,
                content
            )
            VALUES (
                ${id},
                ${title},
                ${type},
                ${viewer},
                ${JSON.stringify(content)}
            )
        `;


        return res.status(200).json({
            success: true,
            share: {
                id,
                title,
                type,
                viewer,
                url: `/sharing/${id}`
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Failed to create assignment."
        });

    }

}
