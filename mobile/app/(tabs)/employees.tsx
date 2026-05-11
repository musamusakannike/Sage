import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants'

const Employees = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Employees</Text>
    </View>
  )
}

export default Employees

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 20,
    color: Colors.text,
  },
})
