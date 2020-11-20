module.exports = app => {
    const save = (req, res) => {
        return res.json({ 'User': 'save' })
    }

    return { save }
}