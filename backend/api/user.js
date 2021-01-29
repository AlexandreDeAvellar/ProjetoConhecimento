const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;
    const { tb } = app.config.tbNames;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    const save = async (req, res) => {
        const user = { ...req.body };
        if (req.params.id) user.id = req.params.id;

        if(!req.originalUrl.startsWith('/users')) user.admin = false;
        if(!req.user || !req.user.admin) user.admin = false;

        try {
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'E-mail não informado');
            existsOrError(user.password, 'Senha não informada');
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida');
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');
            const userFromDB = await app.db(tb.users).where({ email: user.email }).first();
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado');
            }
        } catch (msg) {
            return res.status(400).send(msg);
        }
        user.password = encryptPassword(user.password);
        delete user.confirmPassword;

        if (user.id) {
            app.db(tb.users)
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(e => res.status(204).send())
                .catch(err => res.status(500).send(err));
        } else {
            app.db(tb.users)
                .insert(user)
                .then(e => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }

    }

    const getById = async (req, res) => {
        const { id } = req.params;
        await app.db(tb.users)
            .select('admin', 'id', 'email', 'name')
            .where({ id: id })
            .whereNull('deletedAt')
            .first()
            .then(us => res.status(200).json(us))
            .catch(err => res.status(500).json(err))
    }

    const get = async (req, res) => {
        app.db(tb.users).select('id', 'name', 'email', 'admin', 'deletedAt')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).json(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db(tb.articles)
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdate = await app.db(tb.users)
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
            existsOrError(rowsUpdate, 'Usuário não foi encontrado')

            res.status(204).send()

        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}