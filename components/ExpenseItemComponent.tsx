import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ExpenseItem} from '../models/ExpenseItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BlackColor} from '../utils/Color';
import {numberWithCommas} from '../utils/NumberFormat';
import {GlobalStyles} from '../styles';

export const ExpenseItemComponent: React.FC<{
  expense: ExpenseItem;
  index: number;
  cat_name: string;
  group_date: string;
}> = ({
  expense: {id, title, date, amount, type},
  index,
  cat_name,
  group_date,
}) => {
  return (
    <View style={styles.expenseItem}>
      {group_date !== '' ? (
        <View style={styles.expenseCalendar}>
          <Icon name="calendar" />
          <Text>{group_date}</Text>
        </View>
      ) : (
        <View />
      )}
      <View style={styles.expenseContainer}>
        <View style={styles.expenseTextContainer}>
          <View>
            <Text>{cat_name}</Text>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          {type === 'Pengeluaran' ? (
            <Text style={GlobalStyles.colorRed}>
              - Rp{numberWithCommas(amount.toString())}
            </Text>
          ) : (
            <Text style={GlobalStyles.colorGreen}>
              + Rp{numberWithCommas(amount.toString())}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  expenseItem: {
    paddingHorizontal: 20,
  },
  expenseContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#dadada',
    borderWidth: 1,
  },
  expenseCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
  },
  expenseTextContainer: {
    columnGap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: BlackColor,
  },
  expenseDelete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
});