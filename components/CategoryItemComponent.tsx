import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CategoryItem} from '../models/CategoryItem';
import Icon from 'react-native-vector-icons/FontAwesome';

export const CategoryItemComponent: React.FC<{
  category: CategoryItem;
  deleteItem: Function;
  index: number;
}> = ({category: {id, name}, deleteItem, index}) => {
  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryTextContainer}>
        <Text>{index + 1}.</Text>
        <Text style={styles.sectionTitle}>{name}</Text>
        <TouchableOpacity
          style={styles.categoryDelete}
          onPress={() => deleteItem(id)}>
          <Icon name="trash" color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  categoryContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#dadada',
    borderWidth: 1,
  },
  categoryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
  },
  categoryDelete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
});
