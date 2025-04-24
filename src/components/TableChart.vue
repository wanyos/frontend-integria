<template>
  <section class="container">
    <table :class="props.tableClasses">
      <caption>
        {{
          props.title
        }}
      </caption>

      <thead>
        <tr>
          <th v-if="props.firstColumn.length > 0">Months</th>
          <th
            v-for="(item, index) in props.dataColumn"
            :key="index"
            :class="(getSpecialClassForColumn(index), firstBlock)"
          >
            {{ item }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, rowIndex) in props.dataRow" :key="rowIndex">
          <td v-if="props.firstColumn.length > 0">{{ props.firstColumn[rowIndex] }}</td>
          <td
            v-for="(value, key, colIndex) in row"
            :key="colIndex"
            :class="[getColorClass(key, value), getSpecialClassForColumn(colIndex)]"
            :title="colIndex === 4 ? value : ''"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  firstColumn: {
    type: Array,
    default: () => []
  },
  dataColumn: {
    type: Array,
    default: () => []
  },
  dataRow: {
    type: Array,
    default: () => []
  },
  specialColumnIndices: {
    type: Array,
    default: () => []
  },
  specialColumnClasses: {
    type: Array,
    default: () => []
  },
  tableClasses: {
    type: String,
    default: ''
  }
})

const firstBlock = computed(() => (props.specialColumnClasses.length === 0 ? '' : 'first-row'))

const getColorClass = (key, value) => {
  // Convertir el valor a número si es una cadena con el símbolo '%'
  const numericValue = typeof value === 'string' && value.includes('%') ? parseFloat(value) : value
  if ((key === 'tase' || key === 'percent') && numericValue > 0) {
    return 'text-green-500'
  } else if ((key === 'tase' || key === 'percent') && numericValue < 0) {
    return 'text-red-500'
  }
  return ''
}

const getSpecialClassForColumn = index => {
  const position = props.specialColumnIndices.indexOf(index)
  if (position !== -1 && props.specialColumnClasses[position]) {
    return props.specialColumnClasses[position]
  }
  return ''
}
</script>

<style lang="css">
.container {
  /* padding: 25px; */
  width: 100%;
  position: relative;
}

caption {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: normal;
  color: #1a1a1a;
}

table {
  border: 1px solid lightslategray;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.first-row {
  position: sticky;
  top: 0;
  background-color: #edf0f6;
  z-index: 10;
}

/* thead th {
  position: sticky;
  top: 0;
  background-color: #edf0f6;
  z-index: 10;
} */

th {
  position: relative;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: normal;
  color: #1a1a1a;
}

th::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  border-bottom: 2px solid black;
}

td {
  padding: 5px;
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  color: #1a1a1a;
}

.text-green-500 {
  color: #3aa43a;
}

.text-red-500 {
  color: #d82d2d;
}
</style>
