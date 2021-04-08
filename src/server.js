const Hapi = require("@hapi/hapi");
const routes = require("./route");

const init = async() => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "",
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });
    server.route(routes);
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();