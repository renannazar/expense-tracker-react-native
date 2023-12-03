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

function ReportScreen() {
  const [expenses, setExpenses] = useState<ExpenseDayItem[]>([]);
  const [monthExpenses, setMonthExpenses] = useState<ExpenseMonthItem[]>([]);
  const [selectedType, setSelectedType] = useState('Harian');

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
        <ExpenseDayItemComponent key={expense.id} expense={expense} index={i} />
      ));
    } else {
      return monthExpenses.map((expense, i) => (
        <ExpenseMonthItemComponent key={i} expense={expense} index={i} />
      ));
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Pilih Kategori Laporan</Text>
        <Picker
          style={styles.selectInput}
          selectedValue={selectedType}
          onValueChange={setSelectedType}>
          <Picker.Item label="Harian" value="Harian" />
          <Picker.Item label="Bulanan" value="Bulanan" />
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
  selectInput: {
    backgroundColor: 'white',
    marginTop: 5,
  },
});
