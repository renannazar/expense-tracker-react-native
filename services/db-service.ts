import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import {CategoryItem} from '../models/CategoryItem';
import {ExpenseItem} from '../models/ExpenseItem';
import {ExpenseDayItem} from '../models/ExpenseDayItem';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'keuangan.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  const table1 = `CREATE TABLE IF NOT EXISTS categories(
          id INTEGER PRIMARY KEY,
          name TEXT
      );`;

  const table2 = `CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY,
        title TEXT,
        category_id INT,
        amount INT,
        date DATE,
        type TEXT
    );`;

  await db.executeSql(table1);
  await db.executeSql(table2);
};

export const getCategory = async (
  db: SQLiteDatabase,
): Promise<CategoryItem[]> => {
  try {
    const todoItems: CategoryItem[] = [];
    const results = await db.executeSql('SELECT * FROM categories');
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveCategory = async (
  db: SQLiteDatabase,
  todoItems: CategoryItem[],
) => {
  const insertQuery =
    'INSERT OR REPLACE INTO categories(id, name) values' +
    todoItems.map(i => `(${i.id}, '${i.name}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteCategory = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from categories where id = ${id}`;
  await db.executeSql(deleteQuery);
};

export const getExpense = async (
  db: SQLiteDatabase,
): Promise<ExpenseItem[]> => {
  try {
    const expenseItems: ExpenseItem[] = [];
    const results = await db.executeSql(
      'SELECT * FROM expenses ORDER BY date DESC, id DESC',
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        expenseItems.push(result.rows.item(index));
      }
    });
    return expenseItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get expenses !!!');
  }
};

export const saveExpense = async (
  db: SQLiteDatabase,
  expenseItems: ExpenseItem,
) => {
  const insertQuery = `INSERT OR REPLACE INTO expenses(title, category_id, amount, date, type) values ('${expenseItems.title}', '${expenseItems.category_id}','${expenseItems.amount}', '${expenseItems.date}', '${expenseItems.type}')`;
  return db.executeSql(insertQuery);
};

export const getExpenseDay = async (
  db: SQLiteDatabase,
): Promise<ExpenseDayItem[]> => {
  try {
    const expenseItems: ExpenseDayItem[] = [];
    const results = await db.executeSql(
      'SELECT id, date, type, SUM(amount) as total FROM expenses GROUP BY date, type ORDER BY date DESC, type DESC',
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        expenseItems.push(result.rows.item(index));
      }
    });
    return expenseItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get expenses !!!');
  }
};
