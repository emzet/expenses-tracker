import { PrismaClient, TransactionType, User } from '@prisma/client';
import { hash } from 'bcrypt';

const INCOMES_DATA = {
  'Dream Job': [
    'Professional Pillow Fluffer',
    'Pet Food Tester',
    'Personal Shopping Assistant',
    'Chief Cocktail Taster',
    'Professional Traveler',
    'Beach Tester',
    'Chief Fun Officer',
    'Social Media Manager for Celebrities',
    'Chief Ice Cream Taster',
    'Luxury Hotel Bed Tester',
  ],
  'Side Hustle': [
    'Pothole Filler',
    'Professional Cuddler',
    'Personal Shopper for Pets',
    'Professional Video Game Tester',
    'Sneaker Customizer',
    'Treehouse Designer and Builder',
    'Professional Netflix Watcher',
    'Phone Call Scheduler',
    'Dog Wedding Planner',
    'Professional Gift Wrapper',
  ],
  'Passive Income': [
    'Professional Napper',
    'Plant Watering Service',
    'Professional Movie Critic',
    'Bouncy Castle Rental',
    'Cat Cafe Owner',
    'Vintage Clothing Reseller',
    'E-book Author',
    'Stock Photographer',
    'Bitcoin Mining',
    'Airbnb Host',
  ],
};

const EXPENSES_DATA = {
  Transportation: [
    'Transit Costs',
    'Vehicle Expenses',
    'Gas and Maintenance',
    'Travel Budget',
    'Transportation Bills',
    'Mobility Fees',
    'Commuting Expenses',
    'Car Costs',
    'Transit Fees',
    'Transportation Cash Drain',
  ],
  Food: [
    'Meal Expenses',
    'Food Costs',
    'Grocery Bills',
    'Eating Out Fees',
    'Snack Spending',
    'Beverage Expenses',
    'Dining Budget',
    'Foodie Funds',
    'Cuisine Costs',
    'Culinary Cash Drain',
  ],
  'Health Care': [
    'Wellness Spending',
    'Health Costs',
    'Fitness Fees',
    'Care Expenses',
    'Medical Bills',
    'Health Budget',
    'Self-Care Costs',
    'Mind & Body Expenses',
    'Healthy Habits',
    'Wellness Wallet Drain',
  ],
  Entertainment: [
    'Fun Funds',
    'Leisure Spending',
    'Enjoyment Costs',
    'Night Out',
    'Hobby Expenses',
    'Entertainment Budget',
    'Activity Fees',
    'Leisurely Spending',
    'Fun Expenses',
    'Recreational Costs',
  ],
  'Personal Care': [
    'Grooming Costs',
    'Beauty Bills',
    'Hygiene Spending',
    'Personal Care Budget',
    'Self-Care Expenses',
    'Appearance Fees',
    'Wellness Spending',
    'Spa Costs',
    'Health and Beauty Expenses',
    'Grooming Cash Drain',
  ],
  'Debt Payments': [
    'Soul-sucking credit card debt',
    "Loan shark fees (don't tell anyone)",
    'Business loan for my pyramid scheme',
    "My ex's alimony payments",
  ],
  'Clothing and Accessories': [
    'Fashion Frenzy',
    'Accessory Addiction',
    'Fashion Fix',
  ],
  'Gifts and Donations': [
    'Giving Back',
    'Generosity Costs',
    'Charitable Expenses',
    'Gift Giving',
    'Donations Dilemma',
    'Thoughtful Spending',
    'Present Predicament',
    'Giving to Others',
    'Altruistic Expenses',
    'Giving Is Expensive',
  ],
};

const prisma = new PrismaClient();

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const generateTransactions = (
  user: User,
  data: { [key: string]: string[] },
  transactionType: TransactionType,
  iterations = 1,
) => {
  Object.entries(data).map(async ([categoryTitle, categoryItem]) => {
    const category = await prisma.category.upsert({
      where: { title: categoryTitle },
      update: {},
      create: {
        title: categoryTitle,
        authorId: user.id,
        shared: true,
      },
    });

    for (let i = 0; i < iterations; i++) {
      categoryItem.map(async (item) => {
        await prisma.transactionRecord.create({
          data: {
            title: item,
            amount: randomInt(10, 100000),
            type: transactionType,
            categoryId: category.id,
            date: new Date(
              // eslint-disable-next-line prettier/prettier
              `${randomInt(2019, 2022)}-${randomInt(1, 12)}-${randomInt(1, 28)}`,
            ).toUTCString(),
            shared: true,
            authorId: user.id,
          },
        });
      });
    }
  });
};

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'seed@super.admin' },
    update: {},
    create: {
      email: 'seed@super.admin',
      password: await hash('admin', 10),
    },
  });

  await prisma.transactionRecord.deleteMany();

  generateTransactions(adminUser, INCOMES_DATA, TransactionType.INCOME, 10);
  generateTransactions(adminUser, EXPENSES_DATA, TransactionType.EXPENSE, 200);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
