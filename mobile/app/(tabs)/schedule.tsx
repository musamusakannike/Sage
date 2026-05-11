import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants'

const Schedule = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule</Text>
    </View>
  )
}

export default Schedule

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
