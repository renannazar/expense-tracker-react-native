import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {
  createTable,
  deleteCategory,
  getCategory,
  getDBConnection,
  saveCategory,
} from '../services/db-service';
import {CategoryItemComponent} from '../components/CategoryItemComponent';
import {CategoryItem} from '../models/CategoryItem';
import {BlackColor, PrimaryColor} from '../utils/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';

function CategoryScreen() {
  const {t} = useTranslation();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const loadDataCallback = useCallback(async () => {
    try {
      const initCategory = [
        {id: 1, name: t('food_and_drinks')},
        {id: 2, name: t('shopping')},
        {id: 3, name: t('holiday')},
      ];
      const db = await getDBConnection();
      await createTable(db);
      const storedCategory = await getCategory(db);
      if (storedCategory.length) {
        setCategories(storedCategory);
      } else {
        await saveCategory(db, initCategory);
        setCategories(initCategory);
      }
      console.log(storedCategory);
    } catch (error) {
      console.error(error);
    }
  }, [t]);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addCategory = async () => {
    if (!newCategory.trim()) {
      return;
    }
    try {
      const dataCategories = [
        ...categories,
        {
          id: categories.length
            ? categories.reduce((acc, cur) => {
                if (cur.id > acc.id) {
                  return cur;
                }
                return acc;
              }).id + 1
            : 0,
          name: newCategory,
        },
      ];
      setCategories(dataCategories);
      const db = await getDBConnection();
      await saveCategory(db, dataCategories);
      setNewCategory('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteCategory(db, id);
      // Improve delete scene, using an index instead refresh all database
      setCategories([]);
      loadDataCallback();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryCreateContainer}>
            <TextInput
              value={newCategory}
              style={styles.categoryInput}
              onChangeText={text => setNewCategory(text)}
              placeholder={t('add_category')}
              placeholderTextColor={BlackColor}
            />
            <View>
              <TouchableOpacity
                style={styles.categoryTouchable}
                onPress={addCategory}>
                <View style={styles.categoryTouchableContent}>
                  <Icon name="plus" style={styles.colorWhite} />
                  <Text style={styles.colorWhite}>{t('add')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={isDarkTheme ? styles.screenTitleDark : styles.screenTitle}>
            {t('category_list')}
          </Text>
          <View style={styles.categoryItemContainer}>
            {categories.map((category, i) => (
              <CategoryItemComponent
                key={category.id}
                category={category}
                deleteItem={deleteItem}
                index={i}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
  colorWhite: {
    color: '#FFFFFF',
  },
  categoryContainer: {
    margin: 10,
  },
  categoryItemContainer: {
    marginTop: 10,
  },
  categoryCreateContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  categoryTouchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  categoryInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    marginEnd: 10,
    borderRadius: 10,
  },
  categoryTouchable: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BlackColor,
  },
  screenTitleDark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dadada',
  },
});
