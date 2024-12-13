import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';
import fs from 'fs';

const path = './data.json';

const isValidDate = (date) => {
  const startDate = moment('2023-01-01');
  const endDate = moment('2024-12-13');
  return date.isBetween(startDate, endDate, null, '[]');
};

const isWeekday = (date) => {
  const day = date.isoWeekday(); // 1 (Thứ Hai) -> 7 (Chủ Nhật)
  return day >= 1 && day <= 5;
};

const getRandomCommitsForDay = () => random.int(1, 5);

const getRandomCommitMessage = () => {
  const messages = [
    'Fix bug in main logic',
    'Update README.md',
    'Add unit tests for validation',
    'Improve documentation',
    'Refactor code in utils.js',
    'Optimize performance for API calls',
    'Add new feature to dashboard',
    'Fix typos in comments',
    'Update dependencies in package.json',
    'Remove unused imports',
  ];
  return messages[random.int(0, messages.length - 1)];
};

const createOrUpdateFile = () => {
  const fileName = './work-log.txt';
  const logMessage = `Work log update on ${new Date().toISOString()}\n`;
  fs.appendFileSync(fileName, logMessage, 'utf8');
};

const markCommit = async (date, message) => {
  createOrUpdateFile();

  const git = simpleGit();
  await git.add('./work-log.txt');
  await git.commit(message, { '--date': date.toISOString() });
};

const makeCommits = async (n) => {
  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 104);
    const randomDays = random.int(0, 6);

    const randomDate = moment('2023-01-01')
      .add(randomWeeks, 'weeks')
      .add(randomDays, 'days');

    if (isValidDate(randomDate) && isWeekday(randomDate)) {
      const commitsForDay = getRandomCommitsForDay();
      console.log(
        `Creating ${commitsForDay} commit(s) on: ${randomDate.toISOString()}`
      );

      for (let j = 0; j < commitsForDay; j++) {
        const message = getRandomCommitMessage();
        await markCommit(randomDate, message);
      }
    } else {
      console.log(`Skipping weekend or invalid date: ${randomDate.toISOString()}`);
    }
  }

  console.log('Pushing all commits...');
  const git = simpleGit();
  await git.push();
};

makeCommits(1000);
