import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrimaryColor} from '../utils/Color';
import {GlobalStyles} from '../styles';
import {
  createTable,
  getCategory,
  getDBConnection,
  saveExpense,
} from '../services/db-service';
import {CategoryItem} from '../models/CategoryItem';
import {ExpenseItem} from '../models/ExpenseItem';
import {useIsFocused} from '@react-navigation/native';
import {numberWithCommas} from '../utils/NumberFormat';

function AddScreen({navigation}: {navigation: any}) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
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

  const dateFormat = 'YYYY-MM-DD';
  const currDate = moment().format(dateFormat);

  const [selectedType, setSelectedType] = useState('Pengeluaran');
  const [selectedDate, setSelectedDate] = useState(currDate);
  const [selectedKategori, setSelectedKategori] = useState(0);
  const [inputTitle, setInputTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('');

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: evt => {
        const timestamp = evt.nativeEvent.timestamp;
        if (timestamp) {
          const newDate = moment(timestamp).format(dateFormat);
          setSelectedDate(newDate);
        }
      },
    });
  };

  const submitAdd = async () => {
    const numberAmount = inputAmount.replaceAll('.', '');
    const dataAmount = parseInt(numberAmount, 10);
    if (dataAmount < 0 || !inputTitle.trim() || !selectedDate.trim()) {
      return;
    }
    try {
      const db = await getDBConnection();
      const newExpense: ExpenseItem = {
        id: 0,
        title: inputTitle,
        category_id: selectedKategori,
        amount: dataAmount,
        date: selectedDate,
        type: selectedType,
      };

      await saveExpense(db, newExpense);

      setSelectedType('Pengeluaran');
      setSelectedDate(currDate);
      setSelectedKategori(0);
      setInputAmount('');
      setInputTitle('');

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.addContainer}>
      <ScrollView>
        <View style={styles.addContainer}>
          <View style={styles.inputContainer}>
            <Text>Pilih Jenis Keuangan</Text>
            <Picker
              style={styles.selectInput}
              selectedValue={selectedType}
              onValueChange={setSelectedType}>
              <Picker.Item label="Pengeluaran" value="Pengeluaran" />
              <Picker.Item label="Pemasukkan" value="Pemasukkan" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text>Pilih Kategori (Opsional)</Text>
            <Picker
              style={styles.selectInput}
              selectedValue={selectedKategori}
              onValueChange={setSelectedKategori}>
              <Picker.Item label="Tanpa Kategori" value={0} />
              {categories.map(category => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text>Judul Kegiatan</Text>
            <TextInput
              style={styles.addInput}
              value={inputTitle}
              onChangeText={setInputTitle}
              placeholder="Judul pemasukkan atau pengeluaran"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Total {selectedType}</Text>
            <TextInput
              style={styles.addInput}
              keyboardType="decimal-pad"
              value={numberWithCommas(inputAmount)}
              onChangeText={setInputAmount}
              placeholder="Total pemasukkan atau pengeluaran"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Tanggal Kegiatan</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={styles.inputDateButton}>
              <Text style={styles.inputDateLabel}>{selectedDate}</Text>
              <Text>Ubah</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={submitAdd} style={styles.buttonSubmit}>
              <Text style={GlobalStyles.colorWhite}>Tambah {selectedType}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddScreen;

const styles = StyleSheet.create({
  addContainer: {
    padding: 10,
    flex: 1,
  },
  selectInput: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  addInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    marginTop: 5,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputDateButton: {
    flexDirection: 'row',
    alignContent: 'space-between',
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
  },
  inputDateLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  buttonSubmit: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: PrimaryColor,
    marginTop: 10,
    borderRadius: 10,
  },
});
