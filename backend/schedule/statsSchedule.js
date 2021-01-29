const schedule = require('node-schedule');

module.exports = app => {
    const { tb } = app.config.tbNames;
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db(tb.users).count('id').first();
        const categoriesCount = await app.db(tb.categories).count('id').first();
        const articlesCount = await app.db(tb.articles).count('id').first();
        
        const { Stat } = app.api.stat;
        
        const lastStat = await Stat.findOne({}, {}, { sort: { 'createdAt': - 1 } });
        
        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        });
        
        const changeUsers = !lastStat || stat.users !== lastStat.users;
        const changeCategories = !lastStat || stat.categories !== lastStat.categories;
        const changeArticles = !lastStat || stat.articles !== lastStat.articles;
        
        // console.log("Abriu schedule", changeUsers, changeCategories, changeArticles)
        console.log("Refresh schedule")
        if (changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'));
        }
    });
}