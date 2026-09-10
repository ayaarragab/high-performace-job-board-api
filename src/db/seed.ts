import { faker } from '@faker-js/faker';

console.log({
  name: faker.company.name(),
  location: faker.location.country(),
});
