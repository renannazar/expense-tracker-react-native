import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ExpenseDayItem} from '../models/ExpenseDayItem';
import {BlackColor} from '../utils/Color';
import {numberWithCommas} from '../utils/NumberFormat';
import {GlobalStyles} from '../styles';

export const ExpenseDayItemComponent: React.FC<{
  expense: ExpenseDayItem;
  index: number;
}> = ({expense: {id, date, type, total}, index}) => {
  return (
    <View>
      <View style={styles.expenseContainer}>
        <View style={styles.expenseTextContainer}>
          <View>
            <Text>{type}</Text>
            <Text style={styles.sectionTitle}>{date}</Text>
          </View>
          {type === 'Pengeluaran' ? (
            <Text style={GlobalStyles.colorRed}>
              - Rp{numberWithCommas(total.toString())}
            </Text>
          ) : (
            <Text style={GlobalStyles.colorGreen}>
              + Rp{numberWithCommas(total.toString())}
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
