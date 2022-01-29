const functions = require("../../utils");

module.exports = (router) => {
    const db = require("routes");
    router.get('/', (req, resp) => resp.json({ message: 'API que gera encurtador de urls em operação'}));

    //LER TODAS AS URLS
    router.get('/urls', async function (req, resp) {
        const urls = await db.selectURLs();
        resp.json(urls);
    });

    //LER POR ID
    router.get('/urls/byid/:id', async function (req, resp) {
        const id = Number(req.params.id);
        const url = await db.selectURLs(id);
        resp.json(url);
    });

    //LER POR DATA (Formato yyyy-mm-dd)
    router.get('/urls/bydate/:date', async function (req, resp) {
        const date = req.params.date;
        const urls = await db.selectURLs(null,date);
        resp.json(urls);
    });

    //LER POR URL ENCORTADA
    router.get('/:shortener', async function (req, resp) {
        const shortener = req.params.shortener;
        if (shortener === "urls"){
            const urls = await db.selectURLs();
            console.log(urls);
            resp.json(urls);
        } else {
            const url = await db.selectURLs(null, null, shortener);
            console.log(url);
            resp.json(url);
        }
    });

    //CRIAR UMA URL ENCURTADA
    router.post('/urls', async function (req, resp) {
        const urlFull = req.body.url_address.substring(0, 255);
        var urlShort = functions.StrRandom(10);
        var shortener_ok = false;
        var count = 0;
        // Tentativas para criação de uma URL encurtada
        while (!shortener_ok && count < 5) {
            count += 1;
            const url = await db.selectURLs(null, null, urlShort);
            if (url.length === 0)
                shortener_ok = true;
            else
                urlShort = functions.StrRandom(10);
        }
        if (shortener_ok) {
            url = {
                address: urlFull,
                short: urlShort
            }
            await db.insertURL(urlFull, urlShort);
        } else {
            url = {"message": "Não foi possível gerar um encurtador único para a URL. Tente novamente."}
        }
        resp.json(url);
    });
    
}