<template>
  <div class="product-info-card">
    <div class="pic-header">{{ title }}</div>
    <van-button size="small" class="pic-button">{{ buttonText }}</van-button>
    <div class="pic-phones">
      <div v-for="(phone, index) in phonesList" :key="index" class="pic-phone">
        <van-icon name="phone-o" class="pic-phone-icon" />
        <span>{{ phone }}</span>
      </div>
    </div>
    <div class="pic-qr-section">
      <div class="pic-qr-label"><strong>Scan</strong><br />Follow Us</div>
      <div class="pic-qr-code">
        <van-image v-if="qrCodeUrl" :src="qrCodeUrl" width="80" height="80" fit="cover" />
        <span v-else style="color: #999; font-size: 10px;">QR Code</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Image, Button } from 'vant'

export default {
  name: 'ProductInfoCard',
  components: { 'van-icon': Icon, 'van-image': Image, 'van-button': Button },
  props: {
    title: { type: String, default: 'YGCOMBI-Lat' },
    buttonText: { type: String, default: 'Contact Us' },
    phones: { type: String, default: '+86-13928889037,13928889037' },
    qrCodeUrl: { type: String, default: '' }
  },
  data() {
    let phonesList = []
    if (typeof this.phones === 'string') {
      phonesList = String(this.phones || '').split(',').map(s => s.trim()).filter(Boolean)
    } else {
      phonesList = this.phones || []
    }
    return { phonesList }
  }
}
</script>

<style scoped>
.product-info-card {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 0;
}
.pic-header {
  color: #8B1A1A;
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 12px;
}
.pic-button :deep(.van-button) {
  background: linear-gradient(135deg, #8B1A1A 0%, #A3231F 100%);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  border: none;
  border-radius: 0;
  width: 100%;
  height: auto;
}
.pic-phones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.pic-phone {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333333;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
.pic-phone-icon {
  color: #8B1A1A;
  font-size: 16px;
}
.pic-qr-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 8px;
}
.pic-qr-label {
  color: #666666;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
}
.pic-qr-label strong {
  color: #8B1A1A;
  font-size: 14px;
}
.pic-qr-code {
  width: 80px;
  height: 80px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #DDDDDD;
}
</style>
