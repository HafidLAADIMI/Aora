import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InofBox = ({title,subtitle,containerStyles,titleStyles}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white font-semibold text-center ${titleStyles}`}>{title}</Text>
      <Text className="text-sm font-pregular text-gray-100 text-center">{subtitle}</Text>
    </View>
  )
}

export default InofBox

const styles = StyleSheet.create({})