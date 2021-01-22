const queries = require('./queries');

module.exports = app => {
    const { existsOrError } = app.api.validation;
    const { tb } = app.config.tbNames;

    const save = (req, res) => {
        const articles = { ...req.body };
        if (req.params.id) articles.id = parseInt(req.params.id);

        try {
            existsOrError(articles.name, 'Nome não informado');
            existsOrError(articles.description, 'Descrição não informada');
            existsOrError(articles.categoryId, 'Categoria não informada');
            existsOrError(articles.userId, 'Autor não informado');
            existsOrError(articles.content, 'conteúdo não informado');
        } catch (msg) {
            res.status(400).json(msg);
        }

        if (articles.id) {
            app.db(tb.articles)
                .update(articles)
                .where({ id: articles.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).json(`Erro ao atualizar.`));
        } else {
            app.db(tb.articles)
                .insert(articles)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).json(err));
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db(tb.articles)
                .where({ id: req.params.id }).del();
            existsOrError(rowsDeleted, 'Artigo não foi encontrado');
            res.status(204).send();
        } catch (msg) {
            res.status(400).send(msg);
        }
    }

    const limit = 10;
    const get = async (req, res) => {
        const page = req.query.page || 1;

        const result = await app.db(tb.articles).count('id').first();
        const count = parseInt(result.count);

        app.db(tb.articles)
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err));
    }

    const getById = (req, res) => {
        app.db(tb.articles)
            .where({ id: req.params.id })
            .first()
            .then(articles => {
                articles.content = articles.content.toString();
                return res.json(articles);
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id;
        const page = req.query.page || 1;
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id);

        app.db({ a: 'wm_backend.articles', u: 'wm_backend.users' })
                .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
                .limit(limit).offset(page * limit - limit)
                .whereRaw('?? = ??', ['u.id', 'a.userId'])
                .whereIn('categoryId', ids)
                .orderBy('a.id', 'desc')
                .then(articles => res.json(articles))
                .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}