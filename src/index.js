const { GraphQLServer } = require('graphql-yoga');

// fake data...
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Full stack tutorial for GraphQL using multiple implementation stacks',
}];

let idCount = links.length;

const resolvers = {
    Query: {
        info: () => `This is the API of a Hacker News clone`,
        feed: () => links,
        link: (root, args) => {
            const a = links.filter(v => v.id === args.id);
            if (a.length === 0) return null;
            return a[0];
        }
    },
    Mutation: {
        post: (root, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link);
            return link;
        },
        updateLink: (root, args) => {
            const a = links.filter(v => v.id === args.id);
            if (a.length === 0) return null;
            if (args.url !== null && args.url !== undefined) a[0].url = args.url;
            if (args.description !== null && args.description != undefined) a[0].description = args.description;
            return a[0];
        },
        deleteLink: (root, args) => {
            const a = links.filter(v => v.id === args.id);
            if (a.length === 0) return null;
            links = links.filter(v => v.id !== args.id);
            return a[0];
        }
    }
};

const server = new GraphQLServer({
    typeDefs: `./src/schema.graphql`,
    resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

