const { printSchema } = require('graphql');
const { GraphQLServer, PubSub } = require('graphql-yoga');

const resolvers = {
    Query: {
        info: () => `This is the API of a Hacker News clone`,
    },
    Counter: {
        countStr: counter => `Current count: ${counter.count}`,
    },
    Subscription: {
        counter: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).substring(2, 15); // random channel name
                let count = 0;
                setInterval(() => pubsub.publish(channel, { counter: { count: count++} }), 2000)
                return pubsub.asyncIterator(channel);
            },
        },
    },
};

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: `./src/schema.graphql`,
    resolvers,
    context: { pubsub }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

