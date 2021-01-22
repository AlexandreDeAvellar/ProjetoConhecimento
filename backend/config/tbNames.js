

module.exports = app => {
    const tb = {
        schema: "wm_backend"
    }

    tb.categories = `${tb.schema}.categories`;
    tb.articles = `${tb.schema}.articles`;
    tb.users = `${tb.schema}.users`;
    return { tb }
}