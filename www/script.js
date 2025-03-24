// Truy cập các plugin từ window.Capacitor.Plugins
const { LocalNotifications } = window.Capacitor.Plugins;
const { Share } = window.Capacitor.Plugins;
const { Camera } = window.Capacitor.Plugins;
const { Capacitor } = window;

let bmiResult = 0;
let bmiCategory = '';

async function calculateBMI() {
    const heightInput = document.getElementById('height').value;
    const weightInput = document.getElementById('weight').value;

    // Chuyển đổi giá trị thành số
    const height = parseFloat(heightInput);
    const weight = parseFloat(weightInput);

    // Kiểm tra dữ liệu đầu vào
    // Kiểm tra xem có nhập dữ liệu hay không
    if (!heightInput || !weightInput) {
        document.getElementById('result').innerText = "Vui lòng nhập đầy đủ chiều cao và cân nặng!";
        return;
    }

    // Kiểm tra xem giá trị có phải là số hợp lệ hay không
    if (isNaN(height) || isNaN(weight)) {
        document.getElementById('result').innerText = "Chiều cao và cân nặng phải là số hợp lệ!";
        return;
    }

    // Kiểm tra giá trị âm hoặc bằng 0
    if (height <= 0 || weight <= 0) {
        document.getElementById('result').innerText = "Chiều cao và cân nặng phải lớn hơn 0!";
        return;
    }

    // Kiểm tra khoảng giá trị hợp lý cho chiều cao (50 cm đến 250 cm)
    if (height < 50 || height > 250) {
        document.getElementById('result').innerText = "Chiều cao phải từ 50 cm đến 250 cm!";
        return;
    }

    // Kiểm tra khoảng giá trị hợp lý cho cân nặng (10 kg đến 300 kg)
    if (weight < 10 || weight > 300) {
        document.getElementById('result').innerText = "Cân nặng phải từ 10 kg đến 300 kg!";
        return;
    }

    // Tính BMI: BMI = cân nặng (kg) / (chiều cao (m) * chiều cao (m))
    const heightInMeters = height / 100;
    bmiResult = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Đánh giá BMI
    if (bmiResult < 18.5) {
        bmiCategory = "Gầy";
    } else if (bmiResult >= 18.5 && bmiResult < 25) {
        bmiCategory = "Bình thường";
    } else if (bmiResult >= 25 && bmiResult < 30) {
        bmiCategory = "Thừa cân";
    } else {
        bmiCategory = "Béo phì";
    }

    // Hiển thị kết quả
    document.getElementById('result').innerText = `Chỉ số BMI: ${bmiResult} (${bmiCategory})`;
    document.getElementById('shareBtn').style.display = 'block'; // Hiển thị nút "Chia sẻ kết quả"

    // Kiểm tra nền tảng hiện tại
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
        // Hiển thị thông báo cục bộ trên thiết bị di động
        try {
            // Kiểm tra và yêu cầu quyền thông báo
            const { display } = await LocalNotifications.checkPermissions();
            if (display !== 'granted') {
                const { display: newStatus } = await LocalNotifications.requestPermissions();
                if (newStatus !== 'granted') {
                    throw new Error('Quyền thông báo không được cấp.');
                }
            }

            // Lên lịch thông báo
            await LocalNotifications.schedule({
                notifications: [{
                    title: "Kết quả BMI",
                    body: `Chỉ số BMI của bạn: ${bmiResult} (${bmiCategory})`,
                    id: 1,
                    schedule: { at: new Date(Date.now() + 1000) }
                }]
            });
        } catch (error) {
            console.error('Lỗi khi hiển thị thông báo:', error.message, error.stack);
            alert('Không thể hiển thị thông báo. Vui lòng thử lại! Lỗi: ' + error.message);
        }
    } else if (platform === 'web') {
        // Hiển thị thông báo trên web bằng Web Notifications API
        if (Notification.permission === 'granted') {
            new Notification("Kết quả BMI", {
                body: `Chỉ số BMI của bạn: ${bmiResult} (${bmiCategory})`
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Kết quả BMI", {
                        body: `Chỉ số BMI của bạn: ${bmiResult} (${bmiCategory})`
                    });
                }
            });
        }
    }
}

async function shareResult() {
    const platform = Capacitor.getPlatform();

    try {
        if (bmiResult === 0) {
            alert("Vui lòng tính BMI trước khi chia sẻ!");
            return;
        }

        const shareData = {
            title: 'Kết quả BMI',
            text: `Chỉ số BMI của tôi: ${bmiResult} (${bmiCategory}). Tính bằng ứng dụng BMICalculator.`,
            url: 'https://example.com'
        };

        if (platform === 'android' || platform === 'ios') {
            // Sử dụng Share API của Capacitor trên thiết bị di động
            await Share.share({
                title: shareData.title,
                text: shareData.text,
                url: shareData.url,
                dialogTitle: 'Chia sẻ kết quả'
            });
        } else if (platform === 'web') {
            // Sử dụng Web Share API trên trình duyệt
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                // Fallback: Sao chép vào clipboard nếu Web Share API không được hỗ trợ
                await navigator.clipboard.writeText(shareData.text);
                alert('Kết quả đã được sao chép vào clipboard: ' + shareData.text);
            } else {
                // Nếu không hỗ trợ cả Web Share API và Clipboard API
                alert('Trình duyệt không hỗ trợ chia sẻ hoặc sao chép. Vui lòng sao chép thủ công: ' + shareData.text);
            }
        }
    } catch (error) {
        console.error('Lỗi khi chia sẻ:', error.message, error.stack);
        alert('Không thể chia sẻ kết quả. Vui lòng thử lại! Lỗi: ' + error.message);
    }
}

async function takePhoto() {
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
        try {
            // Kiểm tra xem plugin Camera có sẵn không
            if (!Camera) {
                throw new Error('Plugin Camera không khả dụng. Vui lòng kiểm tra cài đặt plugin.');
            }

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: "uri",
                source: "camera"
            });

            const photo = document.getElementById('photo');
            photo.src = image.webPath;
            photo.style.display = 'block';
        } catch (error) {
            console.error('Lỗi chi tiết khi chụp ảnh:', error.message, error.stack);
            alert('Không thể chụp ảnh. Vui lòng thử lại! Lỗi: ' + error.message);
        }
    } else if (platform === 'web') {
        // Thông báo rằng tính năng chụp ảnh chỉ khả dụng trên app
        alert('Tính năng chụp ảnh chỉ khả dụng trên ứng dụng di động!');
    }
}

// Gắn sự kiện cho các nút
document.getElementById('calculateBtn').addEventListener('click', calculateBMI);
document.getElementById('shareBtn').addEventListener('click', shareResult);
document.getElementById('cameraBtn').addEventListener('click', takePhoto);