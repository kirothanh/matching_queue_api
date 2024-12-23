module.exports = {
  generateOTP: (length = 6) => {
    const otp = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    return otp;
  }
}