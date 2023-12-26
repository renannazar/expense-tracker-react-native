import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  DevSettings,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GreenColor, PrimaryColor} from '../utils/Color';
import {GlobalStyles} from '../styles';
import RNFS from 'react-native-fs';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {useTranslation} from 'react-i18next';

function SettingScreen({navigation}: {navigation: any}) {
  const {t} = useTranslation();

  const backupData = async () => {
    try {
      var libDirectory = RNFS.DocumentDirectoryPath.replace(
        'files',
        'databases',
      );

      // const database = await RNFS.readFile(`${libDirectory}/keuangan.db`);
      const targetBackup =
        RNFS.DownloadDirectoryPath +
        '/keuangan_tracker_' +
        moment().unix() +
        '.db';
      // RNFS.writeFile(targetBackup, database, 'utf8');
      await RNFS.copyFile(libDirectory + '/keuangan.db', targetBackup);

      const readDownload = await RNFS.readDir(RNFS.DownloadDirectoryPath);
      console.log(readDownload);
      Alert.alert(
        t('database_backup_success'),
        `${t('saved_to')} ${targetBackup}`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const restoreData = async () => {
    Alert.alert(t('are_you_sure'), t('restore_confirmation'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('procced'),
        onPress: pickFileRestore,
      },
    ]);
  };

  const pickFileRestore = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      if (pickerResult != null) {
        const decodeResult = pickerResult.uri;
        const targetResult =
          RNFS.DocumentDirectoryPath.replace('files', 'databases') +
          '/keuangan.db';

        await RNFS.copyFile(decodeResult, targetResult);

        DevSettings.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const launchStackFirstApp = () => {
    navigation.navigate('stackFirstApp');
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.textLabel}>
          {t('about')} {t('app_name')}
        </Text>
        <Text>{t('app_description')}</Text>
        <Text style={styles.textCaution}>{t('backup_notice')}</Text>

        <TouchableOpacity style={styles.btnBackup} onPress={backupData}>
          <Text style={GlobalStyles.colorWhite}>{t('backup')} Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRestore} onPress={restoreData}>
          <Text style={GlobalStyles.colorWhite}>{t('restore')} Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnLaunch}
          onPress={launchStackFirstApp}>
          <Text>{t('change_language_and_currency')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default SettingScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textLabel: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  textCaution: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  btnBackup: {
    backgroundColor: GreenColor,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnRestore: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnLaunch: {
    marginTop: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
