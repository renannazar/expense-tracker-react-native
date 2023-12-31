import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlackColor, PrimaryColor} from '../utils/Color';
import {ExpenseDayItem} from '../models/ExpenseDayItem';
import {
  createTable,
  getDBConnection,
  getExpenseDay,
  getExpenseMonth,
} from '../services/db-service';
import {ExpenseDayItemComponent} from '../components/ExpenseDayItemComponent';
import {Picker} from '@react-native-picker/picker';
import {ExpenseMonthItem} from '../models/ExpenseMonthItem';
import {ExpenseMonthItemComponent} from '../components/ExpenseMonthItemComponent';
import {MMKV} from 'react-native-mmkv';
import {useTranslation} from 'react-i18next';

function ReportScreen() {
  const {t} = useTranslation();
  const [expenses, setExpenses] = useState<ExpenseDayItem[]>([]);
  const [monthExpenses, setMonthExpenses] = useState<ExpenseMonthItem[]>([]);
  const [selectedType, setSelectedType] = useState('Harian');

  const storage = new MMKV();
  const appCurrency = storage.getString('app_currency');

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedExpense = await getExpenseDay(db);
      if (storedExpense.length > 0) {
        setExpenses(storedExpense);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadMothDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedMonthExpense = await getExpenseMonth(db);
      console.log(storedMonthExpense);
      if (storedMonthExpense.length > 0) {
        setMonthExpenses(storedMonthExpense);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (selectedType === 'Harian') {
      loadDataCallback();
    } else {
      loadMothDataCallback();
    }
  }, [loadDataCallback, loadMothDataCallback, selectedType]);

  function renderExpenseItem() {
    if (selectedType === 'Harian') {
      return expenses.map((expense, i) => (
        <ExpenseDayItemComponent
          key={expense.id}
          expense={expense}
          index={i}
          currency={appCurrency}
        />
      ));
    } else {
      return monthExpenses.map((expense, i) => (
        <ExpenseMonthItemComponent
          key={i}
          expense={expense}
          index={i}
          currency={appCurrency}
        />
      ));
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>{t('select_report_category')}</Text>
        <Picker
          style={styles.selectInput}
          selectedValue={selectedType}
          onValueChange={setSelectedType}>
          <Picker.Item label={t('daily')} value="Harian" />
          <Picker.Item label={t('monthly')} value="Bulanan" />
        </Picker>
      </View>
      <ScrollView>
        <View style={styles.container}>{renderExpenseItem()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReportScreen;
const styles = StyleSheet.create({
  container: {
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
  selectInput: {
    marginTop: 5,
  },
});
