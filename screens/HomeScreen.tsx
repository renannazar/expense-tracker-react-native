import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BlackColor, GreenColor, PrimaryColor, RedColor} from '../utils/Color';
import {ExpenseItem} from '../models/ExpenseItem';
import {
  createTable,
  deleteExpense,
  getCategory,
  getDBConnection,
  getExpense,
} from '../services/db-service';
import {useIsFocused} from '@react-navigation/native';
import {ExpenseItemComponent} from '../components/ExpenseItemComponent';
import {CategoryItem} from '../models/CategoryItem';
import {numberWithCommas} from '../utils/NumberFormat';
import {MMKV} from 'react-native-mmkv';
import {useTranslation} from 'react-i18next';
import {GlobalStyles} from '../styles';

function HomeScreen({navigation}: {navigation: any}) {
  const {t} = useTranslation();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [summarySpend, setSummarySpend] = useState<string>('0');
  const [summaryIncome, setSummaryIncome] = useState<string>('0');
  const [summarySaving, setSummarySaving] = useState<string>('0');

  const storage = new MMKV();
  const appCurrency = storage.getString('app_currency');

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedExpense = await getExpense(db);
      if (storedExpense.length > 0) {
        setExpenses(storedExpense);

        // Check summary data
        var totalSpend = 0;
        var totalIncome = 0;
        storedExpense.forEach(expense => {
          if (expense.type === 'Pengeluaran') {
            totalSpend += expense.amount;
          } else {
            totalIncome += expense.amount;
          }
        });
        setSummarySpend(totalSpend.toString());
        setSummaryIncome(totalIncome.toString());
        setSummarySaving((totalIncome - totalSpend).toString());
      }
      // console.log(storedExpense);
      const storedCategory = await getCategory(db);
      if (storedCategory.length > 0) {
        setCategories(storedCategory);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Using use focus effect for force refresh data when switch between screen
  const isFocused = useIsFocused();
  useEffect(() => {
    navigation.addListener('focus', () => {
      if (isFocused) {
        loadDataCallback();
      }
    });
    // console.log(totalFocused);
  }, [isFocused, loadDataCallback, navigation]);

  const addCallback = () => {
    navigation.navigate('Add');
  };

  const getCategoryName = (id: number) => {
    const findCat = categories.find(o => o.id === id);
    if (findCat) {
      return findCat.name;
    }
    return t('uncategorized');
  };

  const getGroupDate = (expense: ExpenseItem, index: number) => {
    const prevExpense = expenses[index - 1];
    if (prevExpense) {
      if (prevExpense.date === expense.date) {
        return '';
      }
      return expense.date;
    }
    if (index === 0) {
      return expense.date;
    }
    return '';
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteExpense(db, id);
      // Improve delete scene, using an index instead refresh all database
      let newExpenses = expenses.filter(e => {
        return e.id !== id;
      });

      setExpenses(newExpenses);

      // Check summary data
      var totalSpend = 0;
      var totalIncome = 0;
      newExpenses.forEach(expense => {
        if (expense.type === 'Pengeluaran') {
          totalSpend += expense.amount;
        } else {
          totalIncome += expense.amount;
        }
      });
      setSummarySpend(totalSpend.toString());
      setSummaryIncome(totalIncome.toString());
      setSummarySaving((totalIncome - totalSpend).toString());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={addCallback}
          style={styles.touchableOpacityStyle}>
          <Icon name="plus" size={20} color={'#FFFFFF'} />
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.heroCardContainer}>
            <View style={styles.heroCardItem}>
              <Icon name="minus" color={RedColor} size={25} />
              <Text style={styles.heroCardItemTitle}>{t('expenses')}</Text>
              <Text style={GlobalStyles.colorDark}>
                {appCurrency}
                {numberWithCommas(summarySpend)}
              </Text>
            </View>
            <View style={styles.heroCardItem}>
              <Icon name="plus" color={GreenColor} size={25} />
              <Text style={styles.heroCardItemTitle}>{t('income')}</Text>
              <Text style={GlobalStyles.colorDark}>
                {appCurrency}
                {numberWithCommas(summaryIncome)}
              </Text>
            </View>
            <View style={styles.heroCardItem}>
              <Icon name="credit-card" color={BlackColor} size={25} />
              <Text style={styles.heroCardItemTitle}>{t('saving')}</Text>
              <Text style={GlobalStyles.colorDark}>
                {appCurrency}
                {numberWithCommas(summarySaving)}
              </Text>
            </View>
          </View>
          <View>
            {expenses.map((expense, i) => (
              <ExpenseItemComponent
                key={expense.id}
                expense={expense}
                index={i}
                cat_name={getCategoryName(expense.category_id)}
                group_date={getGroupDate(expense, i)}
                on_delete={deleteItem}
                currency={appCurrency}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 10,
    backgroundColor: PrimaryColor,
    borderRadius: 100,
    display: 'none',
  },
  heroCardContainer: {
    flexDirection: 'row',
    margin: 20,
    gap: 5,
  },
  heroCardItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingVertical: 15,
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dadada',
  },
  heroCardItemTitle: {
    marginTop: 5,
    color: BlackColor,
    fontSize: 16,
  },
});
