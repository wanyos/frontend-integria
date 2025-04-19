<template>
  <section class="container__response">
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
  </section>
</template>

<script setup>
const props = defineProps({
  emailResponse: {
    type: Object,
    default: () => null
  }
})
</script>

<style lang="css" scoped>
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
