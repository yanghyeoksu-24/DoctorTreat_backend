// 1) 입력창 포커스 및 블러 이벤트 처리
const focusBtn = document.querySelectorAll(".Doctor-input-group");

const messages = [
   "아이디가 필요합니다",
   "비밀번호가 필요합니다",
   "비밀번호 확인이 필요합니다",
   "이름이 필요합니다",
   "우편번호가 필요합니다",
   "주소가 필요합니다", 
   "상세주소가 필요합니다",
   "핸드폰 번호가 필요합니다",
   "",
   "병원이름이 필요합니다",
   "병원번호가 필요합니다",
   "면허번호가 필요합니다",
   "진료과목이 필요합니다"
];

focusBtn.forEach((inputGroup, index) => {
   const input = inputGroup.querySelector("input");
   const message = inputGroup.querySelector(".Doctorjoin-Null");

   if (input && message) {
      // 1) 입력창 포커스 시 border 3px blue
      input.addEventListener("focus", () => {
         input.style.outline = "none";
         input.style.border = "3px solid blue";
         message.textContent = "";
         message.style.color = "";
      });

      // 2) 블러 시 값이 없으면 빨간색, 값이 있으면 원래 기본 값
      input.addEventListener("blur", () => {
         if (!input.value) {
            input.style.border = "2px solid red";
            message.textContent = messages[index];
            message.style.color = "red";
         } else {
            input.style.border = "";
            message.textContent = "";
            message.style.color = "";

            // 3) 아이디 유효성 검사
            if (index === 0) {
               const usernamePattern = /^[a-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{5,20}$/;
               if (!usernamePattern.test(input.value)) {
                  input.style.border = "2px solid red";
                  message.textContent = "아이디는 5~20자의 영문 소문자, 숫자, 특수기호만 사용 가능합니다.";
                  message.style.color = "red";
               }
            }

            // 4) 비밀번호 유효성 검사
            if (index === 1) {
               const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
               if (!passwordPattern.test(input.value)) {
                  input.style.border = "2px solid red";
                  message.textContent = "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
                  message.style.color = "red";
               }
            }

            // 5) 비밀번호 확인 검사
            if (index === 2) {
               const passwordInput = document.querySelector("#doctorPw");
               if (input.value !== passwordInput.value) {
                  input.style.border = "2px solid red";
                  message.textContent = "비밀번호가 일치하지 않습니다.";
                  message.style.color = "red";
               }
            }
         }
      });
   }
});

// 2) 비밀번호 토글 기능
const viewicon1 = document.querySelector(".Doctor-view-first");
const noviewicon1 = document.querySelector(".Doctor-noview-first");
const passwordInput = document.getElementById('doctorPw');

const viewicon2 = document.querySelector(".Doctor-view-second");
const noviewicon2 = document.querySelector(".Doctor-noview-second");
const confirmPasswordInput = document.getElementById('doctorConfirmPw');

// 첫 번째 비밀번호 토글 (비밀번호 보이기/숨기기)
if (viewicon1 && noviewicon1 && passwordInput) {
   viewicon1.addEventListener("click", () => {
      passwordInput.type = "text";
      viewicon1.style.display = "none";
      noviewicon1.style.display = "block";
   });

   noviewicon1.addEventListener("click", () => {
      passwordInput.type = "password";
      noviewicon1.style.display = "none";
      viewicon1.style.display = "block";
   });
}

// 두 번째 비밀번호 확인 토글 (비밀번호 확인 보이기/숨기기)
if (viewicon2 && noviewicon2 && confirmPasswordInput) {
   viewicon2.addEventListener("click", () => {
      confirmPasswordInput.type = "text";
      viewicon2.style.display = "none";
      noviewicon2.style.display = "block";
   });

   noviewicon2.addEventListener("click", () => {
      confirmPasswordInput.type = "password";
      noviewicon2.style.display = "none";
      viewicon2.style.display = "block";
   });
}

// 3) 아이디 중복 확인 버튼
document.querySelector("#Doctor-join-checkIdBtn").addEventListener("click", function(event) {
   event.preventDefault(); // 기본 폼 제출 방지
   let doctorId = document.querySelector("#doctorId").value;

   $.ajax({
      url: contextPath + "/doctor/doctorCheckIdOk.do", // ++++경로 수정
      type: "GET",
      data: { doctorId: doctorId },
      success: function(result) {
         if (result === "사용가능") {
            document.querySelector("#checkIdResult").textContent = "사용 가능한 아이디입니다.";
            isIdChecked = true;
         } else {
            document.querySelector("#checkIdResult").textContent = "중복된 아이디입니다.";
            isIdChecked = false;
         }
      },
      error: function() {
         document.querySelector("#checkIdResult").textContent = "오류가 발생했습니다. 다시 시도해주세요.";
         isIdChecked = false;
      }
   });
});

// 4) 전체 약관동의 체크박스 기능
const agreeAllCheckbox = document.getElementById('agree-all-checkbox');
const agreeCheckboxes = document.querySelectorAll('.agree-checkbox');

agreeAllCheckbox.addEventListener('change', () => {
   agreeCheckboxes.forEach(checkbox => {
      checkbox.checked = agreeAllCheckbox.checked; 
   });
});

// 개별 체크박스가 모두 체크되면 전체 동의 체크박스도 체크
agreeCheckboxes.forEach((checkbox) => {
   checkbox.addEventListener("change", () => {
      const allChecked = Array.from(agreeCheckboxes).every((cb) => cb.checked);
      agreeAllCheckbox.checked = allChecked;
   });
});

// 5) 가입 버튼 클릭 시 폼 제출
document.querySelector(".Doctor-signup-btn").addEventListener("click", function(event) {
   const inputs = document.querySelectorAll("input[required]");
   let allFilled = true;

   // 입력란 확인
   inputs.forEach((input) => {
      if (!input.value) {
         allFilled = false;
      }
   });

   // 체크박스 확인
   const allCheckboxesChecked = Array.from(agreeCheckboxes).every(checkbox => checkbox.checked);

   if (!allFilled || !isIdChecked || !allCheckboxesChecked) {
      event.preventDefault();
      if (!isIdChecked) {
         alert("아이디 중복 확인을 해주세요.");
      } else {
         alert("입력란과 체크박스를 모두 채워주세요.");
      }
   } else {
      document.querySelector("form").submit();
   }
});


// 6) 우편번호 API 사용
function execDaumPostcode() {
   new daum.Postcode({
      oncomplete: function(data) {
         var extraAddr = '';
         let addr = '';

         if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
         } else {
            addr = data.jibunAddress;
         }

         if (data.userSelectedType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
               extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
               extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddr !== '') {
               extraAddr = ' (' + extraAddr + ')';
            }
            addr += extraAddr;
         }

         document.getElementById('doctorPostcode').value = data.zonecode;
         document.getElementById("doctorAddress").value = addr;
         document.getElementById("doctorDetailAddress").focus();
      }
   }).open();
}

// 7. 문자 

document.querySelector("#smsButton").addEventListener("click", function(event) {
   event.preventDefault(); // 기본 폼 제출 방지
 

    // 인증번호 받기 버튼 클릭 이벤트

      let phoneNumber = document.querySelector("#doctorPhoneNumber").value;
      console.log(phoneNumber);
        if (phoneNumber) {
            $.ajax({
                url: contextPath + "/doctor/joinSMS.do",
                type: "POST",
                data: { phoneNumber: phoneNumber },
                success: function(response) {
                    alert(response);
                    
                },
                error: function(xhr, status, error) {
                    alert("오류 발생: " + xhr.responseText);
                }
            });
        } else {
            alert("휴대폰 번호를 입력해주세요.");
        }
});

//8. 인증완료
 document.querySelector("#phonecheck3").addEventListener("click", function() {
        // p 태그에 "인증 완료" 텍스트 추가 및 색상 설정
        var phoneCheckElement = document.getElementById("phoneCheck");
        phoneCheckElement.textContent = "인증 완료";
        phoneCheckElement.style.color = "red"; // 텍스트 색상 빨간색으로 설정
    });