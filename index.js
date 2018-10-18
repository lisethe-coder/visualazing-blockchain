'use strict';
var app = new Vue({
	el: '#app',
	data: {
		block1CurrentHash: '',
		genesisHash: '',
		block1TimeStamp: '',
		block2Hash: '',
		block2TimeStamp: '',
		block2CurrentHash: '',
		block3CurrentHash: '',
		block3TimeStamp: '',
		// block3Hash: '',
		bgndColor: '',
		colour: '#52B1DB',
	},
	methods: {
		getTimeSTamp() {
			var date = new Date();
			var monthReal = date.getMonth()+1;

			var hours = date.getUTCHours()+1;
			var minutes = date.getUTCMinutes() +1;
			var seconds = date.getUTCSeconds() +1;
			return `${date.getDate()}/
							${monthReal < 10 ? '0'+monthReal: monthReal}/
							${date.getFullYear()}, 
							${hours}:${minutes}:${seconds}`;
			
		},
		calculateColor: function(oldHash2, hash2) {
			console.log(oldHash2 + '  ' + hash2);

			if(oldHash2.length > 0 && hash2.length > 0) {
				console.log('first log');
				if(oldHash2 !== hash2) {
					console.log('second log');
				this.bgndColor = '#DC3545';
				this.colour = '#DC3545'; 
				this.$refs.text.innerHTML = 'Blockchain is Invalid';
			}
			}
		},
		submitBlock1() {
			console.log('foo');
			// Set default value to 0000 
			this.genesisHash = '0000';
			this.block1TimeStamp = this.getTimeSTamp();
			
			var message = this.amount1 || this.sender1 || this.recipient1;
			
			/* async word means one simple thing: 
				a function always returns a promise. 
			*/
			async function sha256(message) {
			    // encode as UTF-8
			    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

			    // hash the message
			    let hashBuffer;
			    try {
			    	hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); // await makes this line wait till the promise settles and return its result 
			    } catch(err) {
			    	console.log(err);
			    }


			    // convert ArrayBuffer to Array
			    const hashArray = Array.from(new Uint8Array(hashBuffer));

			    // convert bytes to hex string
			    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
		    	return hashHex;
			}
			sha256(message).then((hashVal)=>{
				this.block1CurrentHash = hashVal;
			});
		},
		submitBlock2() {
			// Reference to previous's hash value
			this.block2Hash = this.block1CurrentHash;

			this.block2TimeStamp = this.getTimeSTamp();
	
			var message = this.amount2 || this.sender2 || this.recipient2;
			async function sha256(message) {
			    // encode as UTF-8
			    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

			    // hash the message
			    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

			    // convert ArrayBuffer to Array
			    const hashArray = Array.from(new Uint8Array(hashBuffer));

			    // convert bytes to hex string
			    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
		    	return hashHex;
			}
			sha256(message).then((hashVal)=>{
				this.block2CurrentHash = hashVal;
			});

			var that = this;
			return function() {
				that.calculateColor(that.block2CurrentHash, that.block3Hash);
			};
		},
		causeBlock2Tamper() {
			this.a = this.submitBlock2();
			this.a();
		},
		submitBlock3() {
			// Reference to previous's hash value
			this.block3Hash = this.block2CurrentHash;

			this.block3TimeStamp = this.getTimeSTamp();
			
			var message = this.amount3 || this.sender3 || this.recipient3;
			
			async function sha256(message) {
			    // encode as UTF-8
			    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

			    // hash the message
			    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

			    // convert ArrayBuffer to Array
			    const hashArray = Array.from(new Uint8Array(hashBuffer));

			    // convert bytes to hex string
			    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
		    	return hashHex;
			}
			sha256(message).then((hashVal) => {
				this.block3CurrentHash = hashVal;
			});
		},
	},
});
