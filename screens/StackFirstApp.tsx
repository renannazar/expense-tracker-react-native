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
import {useTranslation} from 'react-i18next';
import {changeLanguage} from 'i18next';

function StackFirstApp({navigation}: {navigation: any}) {
  const {t} = useTranslation();

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

  const currentLang =
    storage.getString('app_lang') === undefined
      ? 'en'
      : (storage.getString('app_lang') as string);
  const currentCurrency =
    storage.getString('app_currency') === undefined
      ? 'Rp'
      : (storage.getString('app_currency') as string);

  const [selectedLanguage, setSelectedLanguage] = useState(currentLang);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const saveConfiguration = () => {
    storage.set('app_lang', selectedLanguage);
    storage.set('app_currency', selectedCurrency);
    storage.set('app_first_open', false);

    changeLanguage(selectedLanguage);
    navigation.navigate('stackMainApp');
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.textTitle}>
          {t('welcome_to')} {t('app_name')}
        </Text>
        <Text style={styles.textCaution}>{t('app_description')}</Text>

        <View>
          <Text>{t('select_language')} :</Text>
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
          <Text>{t('select_currency')} :</Text>
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
          <Text style={GlobalStyles.colorWhite}>{t('start')}</Text>
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
