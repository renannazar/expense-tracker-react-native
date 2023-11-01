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

function SettingScreen() {
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
      Alert.alert('Berhasil Backup Database', `Tersimpan di ${targetBackup}`);
    } catch (error) {
      console.error(error);
    }
  };

  const restoreData = async () => {
    Alert.alert(
      'Apakah anda yakin?',
      'Dengan melakukan Restore, data sebelumnya akan dihapus dan digantikan data yang baru',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Lanjutkan',
          onPress: pickFileRestore,
        },
      ],
    );
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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.textLabel}>Tentang Keuangan Tracker App</Text>
        <Text>
          Keuangan Tracker merupakan aplikasi sederhana yang dikembangkan untuk
          kebutuhan pencatatan laporan keuangan pengguna secara simple dan mudah
          untuk digunakan. Privasi sangat terjamin, semua data tersimpan pada
          smartphone pengguna, kami tidak menyimpan satupun laporan pengguna
          aplikasi
        </Text>
        <Text style={styles.textCaution}>
          PERHATIAN : Ketika pengguna melakukan uninstall atau menghapus data
          aplikasi, maka seluruh data akan terhapus sepenuhnya. Silahkan backup
          data terlebih dahulu
        </Text>

        <TouchableOpacity style={styles.btnBackup} onPress={backupData}>
          <Text style={GlobalStyles.colorWhite}>Backup Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRestore} onPress={restoreData}>
          <Text style={GlobalStyles.colorWhite}>Restore Data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default SettingScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
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
});
