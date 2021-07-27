import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector("form");
    const locateUserBtn = document.getElementById("locate-btn");
    this.shareBtn = document.getElementById('share-btn');

    locateUserBtn.addEventListener("click", this.locateUserHandler.bind(this));
    addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
    this.shareBtn.addEventListener('click', this.sharePlaceHandler);
  }
  
  sharePlaceHandler() {

    const shareLinkInputElement = document.getElementById('share-link');
    // old browser which does not support clipboard
    if (!navigator.clipboard) {
      // alert('Your browser does not support clipboard copy. Plase copy the link yourself.');
      shareLinkInputElement.select();
      return;
    }

    // here goes modern browser with clipboard api available;
    navigator.clipboard.writeText(shareLinkInputElement.value).then(() => {
      alert('Copied into clipboard!');
    }).catch(err => {
      console.log(err);
      // some fallback code to highlight the link
      shareLinkInputElement.select();
    });
  }
	
	selectPlace(coordinates, address) {
		if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    fetch("http://localhost:3000/add-location", {
      method: "POST",
      body: JSON.stringify({
        address: address,
        lat: coordinates.lat,
        lng: coordinates.lng,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const locationId = data.locId;
        console.log(data);
        this.shareBtn.disabled=false;
        const shareLinkInputElement = document.getElementById('share-link');
        shareLinkInputElement.value = `${
          location.origin
        }/my-place?location=${locationId}`;
      });
	}

  locateUserHandler() {
    // quit in case of browser fail to geolocate user
    if (!navigator.geolocation) {
      alert(
        "Geolocation not available. Please user a modern browser or enter manually your address."
      );
      return;
    }
    const modal = new Modal(
      "loading-modal-content",
      "Loading location - please wait!"
    );
    modal.show();
    navigator.geolocation.getCurrentPosition(
      async (successResult) => {
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);
        modal.hide();
				this.selectPlace(coordinates, address);
      },
      (error) => {
        modal.hide();
        alert(
          "Could not locate you unfortunately. Please enter an address manually!"
        );
      }
    );
  }
  async findAddressHandler(event) {
		event.preventDefault();
		const address = event.target.querySelector('input').value;
		if (!address || address.trim().length === 0) {
			alert('Invalid address entered. Please try again!');
			return;
    }
		const modal = new Modal(
      "loading-modal-content",
      "Loading location - please wait!"
    );
    modal.show();
    try {
      const coordinates = await getCoordsFromAddress(address);
      console.log(coordinates);
      this.selectPlace(coordinates, address);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
    modal.hide();
	}
}

new PlaceFinder();
