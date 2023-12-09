import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PrimaryColor} from '../utils/Color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlobalStyles} from '../styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Picker} from '@react-native-picker/picker';
import currencies from '../utils/common-currency.json';
import {MMKV} from 'react-native-mmkv';

function StackFirstApp({navigation}: {navigation: any}) {
  const languages = [
    {
      id: 'en',
      name: 'English',
    },
    {
      id: 'id',
      name: 'Indonesia',
    },
  ];

  const storage = new MMKV();

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('Rp');

  const saveConfiguration = () => {
    storage.set('app_lang', selectedLanguage);
    storage.set('app_currency', selectedCurrency);
    storage.set('app_first_open', false);

    navigation.navigate('stackMainApp');
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.textTitle}>Selamat Datang di Keuangan Tracker</Text>
        <Text style={styles.textCaution}>
          Keuangan Tracker merupakan aplikasi sederhana yang dikembangkan untuk
          kebutuhan pencatatan laporan keuangan pengguna secara simple dan mudah
          untuk digunakan. Privasi sangat terjamin, semua data tersimpan pada
          smartphone pengguna, kami tidak menyimpan satupun laporan pengguna
          aplikasi
        </Text>

        <View>
          <Text>Pilih Bahasa :</Text>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={setSelectedLanguage}>
            {languages.map(language => (
              <Picker.Item
                key={language.id}
                value={language.id}
                label={language.name}
              />
            ))}
          </Picker>
          <Text>Pilih Mata Uang :</Text>
          <Picker
            selectedValue={selectedCurrency}
            onValueChange={setSelectedCurrency}>
            {currencies.map(currency => (
              <Picker.Item
                key={currency.code}
                value={currency.symbol}
                label={currency.symbol + ' - ' + currency.name}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.btnStart} onPress={saveConfiguration}>
          <Text style={GlobalStyles.colorWhite}>Mulai</Text>
          <Icon color={Colors.white} name="chevron-right" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default StackFirstApp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  textTitle: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
  textCaution: {
    marginVertical: 10,
  },
  btnStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: PrimaryColor,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 30,
  },
});
