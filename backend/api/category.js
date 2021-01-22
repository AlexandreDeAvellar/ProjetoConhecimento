module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation;
    const { tb } = app.config.tbNames;

    const save = (req, res) => {
        const category = { ...req.body };
        if (req.params.id) category.id = req.params.id;

        try {
            existsOrError(category.name, '1. Nome não informado');
        } catch (msg) {
            return res.status(400).send(msg);
        }

        // Se houver id então quero fazer um update.
        if (category.id) {
            app.db(tb.categories)
                .update(category)
                .where({ id: category.id })
                .then(e => res.status(204).send('Salvo com sucesso!'))
                .catch(err => res.status(500).send({ err, 1: 1 }))
        } else {
            // se não houver id então inclui.
            app.db(tb.categories)
                .insert(category)
                .then(e => res.status(204).send('Salvo com sucesso!'))
                .catch(err => res.status(500).send({ err, 2: 2 }))
        }
    }

    const remove = async (req, res) => {
        try {
            const { id } = req.params;
            existsOrError(id, '2. Código da categoria não informado');

            const subcategory = await app.db(tb.categories)
                .where({ parentId: id })
            notExistsOrError(subcategory, '3. Categoria possui subcategorias');

            const articles = await app.db(tb.articles)
                .where({ categoryId: id })
            notExistsOrError(articles, '4. Categoria possui artigos.')

            const rowsDeleted = await app.db(tb.categories)
                .where({ id: id }).del();
            existsOrError(rowsDeleted, '5. Categoria não foi encontrada');

            return res.status(204).send('Deletado!!');

        } catch (err) {
            return res.status(400).send(err);
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            let parent = categories.filter(e => e.id === parentId);
            return parent.length ? parent[0] : null;
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name;
            let parent = getParent(categories, category.parentId);

            while (parent) {
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.parentId);
            }

            return { ...category, path };
        });

        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            return 0;
        });

        return categoriesWithPath;
    }

    const get = (req, res) => {
        app.db(tb.categories)
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send({ err, 3: 3 }))
    }

    const getById = (req, res) => {
        app.db(tb.categories)
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send({ err, 4: 4 }))
    }

    const toTree = (categories, tree) => {
        if (!tree) tree = categories.filter(c => !c.parentId);
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id;
            parentNode.children = toTree(categories, categories.filter(isChild));
            return parentNode;
        });
        return tree;
    }

    const getTree = (req, res) => {
        app.db(tb.categories)
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(err => res.status(500).json(err))
    }

    return { save, remove, get, getById, getTree }

}

