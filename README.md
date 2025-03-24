# BMI Calculator

BMI Calculator là một ứng dụng tính chỉ số BMI (Body Mass Index) sử dụng Capacitor, npm. Ứng dụng hỗ trợ các tính năng:

- Tính toán chỉ số BMI.
- Hiển thị thông báo cục bộ.
- Chia sẻ kết quả BMI.
- Chụp ảnh (tính năng bổ sung).

## Yêu cầu

- **Node.js**: V16 hoặc cao hơn
- **Android Studio**: Để chạy trên Android (hoặc Xcode cho iOS)
- **Thiết bị thật hoặc giả lập Android/iOS**

## Cài đặt

### Clone repository

```bash
git clone <repository-url>
cd <ten-thu-muc>
```

### Cài đặt dependency

```bash
npm install
```

## Cài đặt các plugin Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/camera @capacitor/share @capacitor/local-notifications
```

### Đồng bộ dự án với Android

```bash
npx cap sync
```


### Mở và chạy trên Android

```bash
npx cap open android
```

Sau đó, trong Android Studio, chọn thiết bị (giả lập hoặc thiết bị thật) và nhấn **Run**.

## Sử dụng

1. Nhập **chiều cao (cm)** và **cân nặng (kg)**.
2. Nhấn **"Tính BMI"** để xem kết quả.
3. Sử dụng **"Chia sẻ kết quả"** hoặc **"Chụp ảnh"** (nếu muốn).

## Ảnh ứng dụng
![image](https://github.com/user-attachments/assets/3624bbd1-e824-4c11-8997-70fef76f5a27)
![image](https://github.com/user-attachments/assets/5a0ba749-83ea-4071-8c2a-09dead71d6fc)
![image](https://github.com/user-attachments/assets/8c8fb14e-b383-4fd6-90fb-b6e4d8ec0107)




