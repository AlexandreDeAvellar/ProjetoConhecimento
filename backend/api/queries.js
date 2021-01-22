module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) as (
            SELECT id FROM wm_backend.categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, wm_backend.categories c 
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `,
    teste: `select * from wm_backend.categories`
}