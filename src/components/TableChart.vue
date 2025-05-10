<template>
  <section class="container chart-base">
    <div class="table-scroll">
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
              :class="getSpecialClassForColumn(index)"
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
              :title="colIndex === 5 ? value : ''"
            >
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
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
  specialColumnClasses: {
    type: Object,
    default: () => ({})
  },
  tableClasses: {
    type: String,
    default: ''
  }
})

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
  if (!props.specialColumnClasses || typeof props.specialColumnClasses !== 'object') {
    return ''
  }
  return props.specialColumnClasses[index] || ''
}
</script>

<style lang="css">
.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.table-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 30rem;
  width: 100%;
}

caption {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: normal;
  color: #1a1a1a;
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: #fff;
  padding: 10px 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 10px 5px;
}

thead th {
  position: sticky;
  top: 2.2rem;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid var(--color-text);
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.05);
}

th,
td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  position: relative;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: normal;
  color: #1a1a1a;
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
