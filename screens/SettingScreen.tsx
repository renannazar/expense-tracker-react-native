import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GreenColor, PrimaryColor} from '../utils/Color';
import {GlobalStyles} from '../styles';

function SettingScreen() {
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

        <TouchableOpacity style={styles.btnBackup}>
          <Text style={GlobalStyles.colorWhite}>Backup Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRestore}>
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
