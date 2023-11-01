import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlackColor, PrimaryColor} from '../utils/Color';
import {ExpenseDayItem} from '../models/ExpenseDayItem';
import {
  createTable,
  getDBConnection,
  getExpenseDay,
} from '../services/db-service';
import {useIsFocused} from '@react-navigation/native';
import {ExpenseDayItemComponent} from '../components/ExpenseDayItemComponent';

function ReportScreen({navigation}: {navigation: any}) {
  const [expenses, setExpenses] = useState<ExpenseDayItem[]>([]);

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
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {expenses.map((expense, i) => (
          <ExpenseDayItemComponent
            key={expense.id}
            expense={expense}
            index={i}
          />
        ))}
      </View>
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
});
