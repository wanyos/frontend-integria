<template>
  <section class="card-container">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <div class="div__container">
      <h5>{{ props.title }}</h5>
      <h5 class="name__total">{{ props.count }}</h5>
    </div>
    <div v-if="props.emailResponse === null" class="div__container">
      <ButtonList title="Email To" :emails="props.emailsTo" @new-emails="updateEmailsTo" />
      <ButtonList title="Email Cc" :emails="props.emailsCc" @new-emails="updateEmailsCc" />
    </div>
    <div v-if="props.emailResponse === null" class="div__button">
      <button
        @click="handleClick"
        :disabled="props.emailsTo.length === 0"
        class="btn__send"
        :class="isDisabled"
      >
        Send
      </button>
    </div>

    <div v-if="props.emailResponse !== null" class="container__response">
      <div class="response-header">
        <span :class="['status-badge', props.emailResponse.status.toLowerCase()]">
          {{ props.emailResponse.status }}
        </span>
        <h4>Email sent</h4>
      </div>

      <div class="response-grid">
        <div class="response-label">Status:</div>
        <div class="response-value">{{ props.emailResponse.status }}</div>

        <div class="response-label">Message:</div>
        <div class="response-value">{{ props.emailResponse.message }}</div>

        <div class="response-label">Recipients:</div>
        <div class="response-value email-list">
          <span
            v-for="(email, index) in props.emailResponse.to?.split(',')"
            :key="'to-' + index"
            class="email-tag"
          >
            {{ email.trim() }}
          </span>
        </div>

        <div class="response-label">CC:</div>
        <div class="response-value email-list">
          <span
            v-for="(email, index) in props.emailResponse.cc?.split(',')"
            :key="'cc-' + index"
            class="email-tag"
          >
            {{ email.trim() }}
          </span>
        </div>

        <div class="response-label">Message ID:</div>
        <div class="response-value id-value">{{ props.emailResponse.messageId }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ButtonList from './ButtonList.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const emit = defineEmits(['button-click', 'update:newEmailsTo', 'update:newEmailsCc'])
const isLoading = ref(false)

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  count: {
    type: [String, Number],
    default: ''
  },
  emailsTo: {
    type: Array,
    default: () => []
  },
  emailsCc: {
    type: Array,
    default: () => []
  },
  emailResponse: {
    type: Object,
    default: () => null
  }
})

const isDisabled = computed(() =>
  props.emailsTo.length > 0 ? 'btn__send-enabled' : 'btn__send-disabled'
)

const handleClick = () => {
  isLoading.value = true
  emit('button-click')
}

const updateEmailsTo = emailsTo => {
  emit('update:newEmailsTo', emailsTo)
}

const updateEmailsCc = emailsCc => {
  emit('update:newEmailsCc', emailsCc)
}

watch(
  () => props.emailResponse,
  newValue => {
    if (newValue !== null) {
      isLoading.value = false
    }
  },
  { deep: true }
)
</script>

<style lang="css" scoped>
.card-container {
  border: 1px solid blue;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
}

.div__container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.container__response {
  grid-column: 1 / -1;
}

.name__total {
  margin-right: 3rem;
}

.div__button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn__send {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 4px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.btn__send:hover {
  background-color: var(--hover-button);
}

.btn__send-disabled {
  cursor: not-allowed;
  background-color: rgb(234, 238, 242);
}

.btn__send-disabled:hover {
  background-color: rgb(234, 238, 242);
}

.container__response {
  grid-column: 1 / -1;
  background-color: #f5f8fa;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.response-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.response-header h4 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.success {
  background-color: #e6f7ee;
  color: #0a7c42;
}

.status-badge.error {
  background-color: #ffebe6;
  color: #d73a49;
}

.status-badge.sending {
  background-color: #f1f8ff;
  color: #0366d6;
}

.response-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 12px;
  column-gap: 16px;
  align-items: start;
}

.response-label {
  color: #586069;
  font-weight: 500;
  text-align: right;
}

.response-value {
  color: #24292e;
}

.email-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.email-tag {
  background-color: #e1e4e8;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.id-value {
  font-family: monospace;
  font-size: 0.85rem;
  color: #6a737d;
  word-break: break-all;
}
</style>
