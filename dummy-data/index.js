const faker = require('faker');
const axios = require('axios');

const IDEA_GENERATOR = 'https://appideagenerator.com/call.php';
const IDEA_API = `http://localhost:4000`;

// random between 3 and 10
const randomInt = () => Math.floor(Math.random() * 8 + 3);

const generateIdea = async () => {
  const { data } = await axios.get(IDEA_GENERATOR);
  return data.replace(/\n/g, '');
};

const generateUser = async () => {
  const { data } = await axios.post(`${IDEA_API}/register`, {
    username: faker.internet.userName(),
    password: 'password',
  });

  console.log(data);
  return data.token;
};

const postNewIdea = async token => {
  const idea = await generateIdea();
  const { data } = axios.post(
    `${IDEA_API}/api/ideas`,
    {
      idea,
      description: faker.lorem.paragraph(),
    },
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );

  return idea;
};

(async () => {
  const randNumUsers = randomInt();
  const randNumIdeas = randomInt();

  console.log(randNumUsers, randNumIdeas);
  for (let i = 0; i < randNumUsers; i++) {
    const token = await generateUser();
    for (let j = 0; j < randNumIdeas; j++) {
      const idea = await postNewIdea(token);
    }
  }
})();
