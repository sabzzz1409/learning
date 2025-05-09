// index.mjs
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const incomingData = {
  "msg": "Successfully retrieved orders",
  "orders": [
    {
      "_id": "6800a024351d163db4c7fd0c",
      "orderId": "ORD-20250417-5248",
      "user_name": "Ravi",
      "user_id": "68009889ae3e7a3beb162a1a",
      "phonenum": "9866667486",
      "items": [
        {
          "product_id": "67ade8c362ed3d940af9ef73",
          "quantity": 1,
          "product_name": "Parent Adult",
          "product_price": "450.00",
          "product_image": "https://petparentnxt.in/stores/petimages/adult.png",
          "product_size": "3kg",
          "selling_price": "430.01",
          "compare_price": "500.50",
          "inStock": true,
          "added_at": "2025-04-17T06:29:29.322Z"
        },
        {
          "product_id": "67ade8c362ed3d940af9ef73",
          "quantity": 1,
          "product_name": "Parent Adult",
          "product_price": "450.00",
          "product_image": "https://petparentnxt.in/stores/petimages/adult.png",
          "product_size": "3kg",
          "selling_price": "430.00",
          "compare_price": "500.00",
          "inStock": true,
          "added_at": "2025-04-17T06:29:29.322Z"
        }
      ],
      "total_amount": 450,
      "paymentMethod": "PrePaid",
      "razorpay_payment_id": "pay_QK1hYF2mhkQNOD",
      "razorpay_orderid": "order_QK1h4QoXQt4nCQ",
      "address": {
        "_id": "68009ff1351d163db4c7fd07",
        "fullName": "Ravi",
        "phoneNumber": "9866667486",
        "pinCode": "533101",
        "flatNo": "Amaravathi Software",
        "area": "Sai Brundhavanam Colony",
        "landMark": "",
        "town": "Rajamahendravaram",
        "state": "Andhra Pradesh",
        "addressType": "Home",
        "user_id": "68009889ae3e7a3beb162a1a",
        "showaddress": true,
        "d_in": 0,
        "__v": 0
      },
      "orderDate": "2025-04-17T06:31:00.255Z",
      "status": "success",
      "createdAt": "2025-04-17T06:31:00.255Z",
      "updatedAt": "2025-04-24T04:26:49.465Z",
      "ind": 1,
      "order_status": 4,
      "shipRckt_OrderId": 816401384
    }
  ]
}


export const genInvoice = (data) => {

  const doc = new PDFDocument({ size: 'A4', margin: 10 });
  doc.pipe(createWriteStream('output.pdf'));

  doc.font(resolve('fonts/Raleway-Bold.ttf')).fontSize(20);

  doc.text('Tax Invoice', { align: 'center' });

  // Box container
  const boxX = 50;
  const boxY = 50;
  const boxWidth = 500;
  const boxHeight = 110;
  doc.rect(boxX, boxY, boxWidth, boxHeight).stroke();

  // Insert logo on the left
  const logoPath = resolve('logo.png'); // use uploaded image if needed
  const logoWidth = 80;
  const logoHeight = 100;
  const addressLines = [
    'NUTRITIONNXT PRIVATE LIMITED',
    '1-89/3/20 , Ground Floor,',
    'A & A Lake Front , Durgam Cheruvu',
    'Madhapur , Hyderabad-500081',
    'GSTIN/UIN: 36AAJCN4513D1ZP',
    'State Name : Telangana, Code : 36',
    'E-Mail : cherukury@nutritionnxt.com'
  ];
  const lineHeight = 12;
  const textBlockHeight = addressLines.length * lineHeight;

  // Calculate the tallest block height to center against
  const contentHeight = Math.max(logoHeight, textBlockHeight);
  const verticalPadding = (boxHeight - contentHeight) / 2;

  // Logo position
  const logoX = boxX + 5;
  const logoY = boxY + verticalPadding;
  doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });

  // Text position
  const textX = boxX + logoWidth + 10;
  let currentY = boxY + verticalPadding;
  doc.fontSize(10).font('Helvetica-Bold')
    .text(addressLines[0], textX, currentY);

  doc.font('Helvetica').fontSize(9);
  for (let i = 1; i < addressLines.length; i++) {
    currentY += lineHeight;
    doc.text(addressLines[i], textX, currentY);
  }

  //

  const box2X = boxX + boxWidth / 2 + 5;
  const box2Y = boxY;

  doc.rect(box2X, box2Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Invoice No.', box2X + 5, box2Y + 5);

  doc.font('Helvetica-Bold').fontSize(12)
    .text('NNXT-362526-1', box2X + 5, doc.y)

  //

  const box3X = boxX + (3 * boxWidth / 4) + 5;
  const box3Y = boxY;

  doc.rect(box3X, box3Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Dated', box3X + 5, box3Y + 5);

  const date = new Date(data.orders[0].orderDate);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  }).replace(/ /g, '-');

  doc.font('Helvetica-Bold').fontSize(12)
    .text(formattedDate, box3X + 5, doc.y)

  //

  const box4X = boxX + boxWidth / 2 + 5;
  const box4Y = boxY + boxHeight / 3;

  doc.rect(box4X, box4Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Delivery Note', box4X + 5, box4Y + 5);

  //

  const box5X = boxX + (3 * boxWidth / 4) + 5;
  const box5Y = boxY + boxHeight / 3;

  doc.rect(box5X, box5Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Mode/Terms of Payment', box5X + 5, box5Y + 5);

  //

  const box6X = boxX + boxWidth / 2 + 5;
  const box6Y = boxY + (2 * boxHeight / 3);

  doc.rect(box6X, box6Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Reference No. & Date.', box6X + 5, box6Y + 5);

  //

  const box7X = boxX + (3 * boxWidth / 4) + 5;
  const box7Y = boxY + (2 * boxHeight / 3);

  doc.rect(box7X, box7Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Other References', box7X + 5, box7Y + 5);

  //

  const box8X = boxX;
  const box8Y = boxY + boxHeight;

  doc.rect(box8X, box8Y, (boxWidth / 2) + 5, boxHeight).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Consignee (Ship to)', box8X + 5, box8Y + 5);

  doc.fontSize(11).font('Helvetica-Bold')
    .text(data.orders[0].user_name, box8X + 5, doc.y)

  doc.moveDown(3)

  // doc.fontSize(10).font('Helvetica')
  //   .text('GSTIN/UIN      :    36AAJCN4513D1ZP', box8X + 5)

  doc.fontSize(10).font('Helvetica')
    .text('Address    :'
      + data.orders?.[0]?.address.flatNo
      + ',' + data.orders?.[0]?.address.area
      + ',' + data.orders?.[0]?.address.landMark
      + ',' + data.orders?.[0]?.address.town
      + ',' + data.orders?.[0]?.address.state
      + ',' + data.orders?.[0]?.address.pinCode,
      box8X + 5, doc.y, { align: 'left', width: 300 })


  //

  const box9X = boxX + boxWidth / 2 + 5;
  const box9Y = boxY + boxHeight;

  doc.rect(box9X, box9Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text("Buyer's Order No.", box9X + 5, box9Y + 5);

  //

  const box10X = boxX + (3 * boxWidth / 4) + 5;
  const box10Y = boxY + boxHeight;

  doc.rect(box10X, box10Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Dated', box10X + 5, box10Y + 5);

  //

  const box11X = boxX + boxWidth / 2 + 5;
  const box11Y = boxY + (4 * boxHeight / 3);

  doc.rect(box11X, box11Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Dispatch Doc No.', box11X + 5, box11Y + 5);

  //

  const box12X = boxX + (3 * boxWidth / 4) + 5;
  const box12Y = boxY + (4 * boxHeight / 3);

  doc.rect(box12X, box12Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Delivery Note Date', box12X + 5, box12Y + 5);

  //

  const box13X = boxX + boxWidth / 2 + 5;
  const box13Y = boxY + (5 * boxHeight / 3);

  doc.rect(box13X, box13Y, boxWidth / 4, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Dispatched through', box13X + 5, box13Y + 5);

  //

  const box14X = boxX + (3 * boxWidth / 4) + 5;
  const box14Y = boxY + (5 * boxHeight / 3);

  doc.rect(box14X, box14Y, (boxWidth / 4) - 5, boxHeight / 3).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Destination', box14X + 5, box14Y + 5);

  //

  const box15X = boxX;
  const box15Y = boxY + 2 * boxHeight;

  doc.rect(box15X, box15Y, (boxWidth / 2) + 5, boxHeight).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Buyer (Bill to)', box15X + 5, box15Y + 5);

  doc.fontSize(11).font('Helvetica-Bold')
    .text(data.orders[0].user_name, box8X + 5, doc.y)

  doc.moveDown(3)

  // doc.fontSize(10).font('Helvetica')
  //   .text('GSTIN/UIN      :    36AAJCN4513D1ZP', box15X + 5)

  doc.fontSize(10).font('Helvetica')
    .text('Address     :'
      + data.orders?.[0]?.address.flatNo
      + ',' + data.orders?.[0]?.address.area
      + ',' + data.orders?.[0]?.address.landMark
      + ',' + data.orders?.[0]?.address.town
      + ',' + data.orders?.[0]?.address.state
      + ',' + data.orders?.[0]?.address.pinCode, box15X + 5, doc.y, { align: 'left', width: 300 })

  const box16X = boxX + boxWidth / 2 + 5;
  const box16Y = boxY + 2 * boxHeight;

  doc.rect(box16X, box16Y, (boxWidth / 2) - 5, boxHeight).stroke();

  doc.fontSize(10).font('Helvetica')
    .text('Terms of Delivery', box16X + 5, box16Y + 5);


  const recX = boxX;
  const recY = doc.y + 94;

  doc.rect(recX, recY, boxWidth / 20, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('SI.No.', recX + 2, recY + 10);
  doc.rect(recX + boxWidth / 20, recY, (2 * boxWidth / 5), 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('Description of Goods', recX + boxWidth / 20 + 50, recY + 10);
  doc.rect(recX + (9 * boxWidth / 20), recY, boxWidth / 10, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('HSN/SAC', recX + (9 * boxWidth / 20) + 5, recY + 10);
  doc.rect(recX + (11 * boxWidth / 20), recY, boxWidth / 10, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('Quantity', recX + (11 * boxWidth / 20) + 10, recY + 10);
  doc.rect(recX + (13 * boxWidth / 20), recY, boxWidth / 10, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('Rate', recX + (13 * boxWidth / 20) + 5, recY + 10);
  doc.rect(recX + (15 * boxWidth / 20), recY, boxWidth / 20, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('per', recX + (15 * boxWidth / 20) + 5, recY + 10);
  doc.rect(recX + (16 * boxWidth / 20), recY, boxWidth / 20, 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('Disc', recX + (16 * boxWidth / 20) + 2, recY + 10);
  doc.rect(recX + (17 * boxWidth / 20), recY, (3 * boxWidth / 20), 30).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('Amount', recX + (17 * boxWidth / 20) + 20, recY + 10);

  const rec2y = doc.y + 15;

  const reps = data.orders[0].items.length > 4 ? data.orders[0].items.length + 1 : 4

  for (let i = 0; i < data.orders[0].items.length; i++) {
    doc.fontSize(8).font('Helvetica')
      .text(i + 1, recX + 10, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica-Bold')
      .text(data.orders[0].items[i].product_name, recX + boxWidth / 20 + 5, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica')
      .text('23091000', recX + (9 * boxWidth / 20) + 5, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica-Bold')
      .text(data.orders[0].items[i].quantity + ' NOS', recX + (11 * boxWidth / 20) + 20, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica')
      .text(data.orders[0].items[i].selling_price, recX + (13 * boxWidth / 20) + 10, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica')
      .text('NOS', recX + (15 * boxWidth / 20) + 5, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica')
      .text((data.orders[0].items[i].compare_price - data.orders[0].items[i].selling_price).toFixed(2), recX + (16 * boxWidth / 20) + 2, rec2y + 10 * i);
    doc.fontSize(8).font('Helvetica-Bold')
      .text((data.orders[0].items[i].selling_price * data.orders[0].items[i].quantity).toFixed(2), recX + (17 * boxWidth / 20) + 20, rec2y + 10 * i);
  }

  doc.rect(recX + (17 * boxWidth / 20), recY, (3 * boxWidth / 20), 15.5 * (reps + 4)).stroke();
  doc.rect(recX, recY, (1 * boxWidth / 20), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (boxWidth / 20), recY, (2 * boxWidth / 5), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (9 * boxWidth / 20), recY, (1 * boxWidth / 10), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (11 * boxWidth / 20), recY, (1 * boxWidth / 10), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (13 * boxWidth / 20), recY, (1 * boxWidth / 10), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (15 * boxWidth / 20), recY, (1 * boxWidth / 20), 15.5 * (reps + 4)).stroke();
  doc.rect(recX + (16 * boxWidth / 20), recY, (1 * boxWidth / 20), 15.5 * (reps + 4)).stroke();

  doc.fontSize(8).font('Helvetica')
    .text(data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0), recX + (17 * boxWidth / 20) + 20, rec2y + 10 * (reps + 1));

  doc.fontSize(8).font('Helvetica-Bold')
    .text('CGST 9% OUTWARD', recX + (1 * boxWidth / 20) + 110, rec2y + 10 * (reps + 2));

  doc.fontSize(8).font('Helvetica')
    .text('9', recX + (13 * boxWidth / 20) + 30, rec2y + 10 * (reps + 2));

  doc.fontSize(8).font('Helvetica')
    .text('%', recX + (15 * boxWidth / 20) + 10, rec2y + 10 * (reps + 2));

  doc.fontSize(8).font('Helvetica-Bold')
    .text((data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0) * 0.09).toFixed(2), recX + (17 * boxWidth / 20) + 20, rec2y + 10 * (reps + 2));

  //

  doc.fontSize(8).font('Helvetica-Bold')
    .text('CGST 9% OUTWARD', recX + (1 * boxWidth / 20) + 110, rec2y + 10 * (reps + 3));

  doc.fontSize(8).font('Helvetica')
    .text('9', recX + (13 * boxWidth / 20) + 30, rec2y + 10 * (reps + 3));

  doc.fontSize(8).font('Helvetica')
    .text('%', recX + (15 * boxWidth / 20) + 10, rec2y + 10 * (reps + 3));

  doc.fontSize(8).font('Helvetica-Bold')
    .text((data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0) * 0.09).toFixed(2), recX + (17 * boxWidth / 20) + 20, rec2y + 10 * (reps + 3));

  //

  doc.fontSize(8).font('Helvetica-Bold')
    .text('ROUND OFF', recX + (1 * boxWidth / 20) + 140, rec2y + 10 * (reps + 4));

  doc.fontSize(8).font('Helvetica-Bold')
    .text(
      (
        Math.abs(
          Math.round(
            (
              data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0)
            )
          ) -
          (
            data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0)
          )
        )
      ).toFixed(2),
      recX + (17 * boxWidth / 20) + 30, rec2y + 10 * (reps + 4));

  //

  doc.fontSize(8).font('Helvetica')
    .text('Total', recX + (1 * boxWidth / 20) + 170, rec2y + 10 * (reps + 5) + 5);

  doc.fontSize(8).font('Helvetica-Bold')
    .text(data.orders[0].items.length + ' NOS', recX + (11 * boxWidth / 20) + 20, rec2y + 10 * (reps + 5) + 5);

  doc.fontSize(8).font('Helvetica-Bold')
    .text((data.orders[0].items.reduce((acc, itm) => acc + itm.selling_price * itm.quantity, 0)*1.09).toFixed(2), recX + (17 * boxWidth / 20) + 10, rec2y + 10 * (reps + 5) + 5, { align: 'left', width: 100 });

  doc.rect(recX, rec2y + 10 * (reps + 5), boxWidth, 15).stroke();


  console.log(doc.y)

  if (doc.y > 500) {
    doc.addPage()
  }

  const long_tme_y = doc.y + 10 * (reps - 1);

  doc.rect(recX, long_tme_y - 8, boxWidth, 30).stroke();

  doc.fontSize(7).font('Helvetica')
    .text('Amount Chargeable (in words)', recX + 5, long_tme_y);

  doc.fontSize(10).font('Helvetica')
    .text('E & O.E.', recX + boxWidth - 70, long_tme_y);

  doc.fontSize(10).font('Helvetica-Bold')
    .text('INR Thirteen Thousand Five Hundred Fifty Eight Only', recX + 5, long_tme_y + 10);

  doc.rect(recX, long_tme_y + 22, (40 * boxWidth / 100), 30).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('HSN/SAC', recX + 70, long_tme_y + 32);
  doc.rect(recX + (40 * boxWidth / 100), long_tme_y + 22, (10 * boxWidth / 100), 30).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('Taxable Value', recX + (40 * boxWidth / 100) + 2, long_tme_y + 32, {
      width: 40, // wrap text within 300 points
      align: 'center'
    })
  doc.rect(recX + (50 * boxWidth / 100), long_tme_y + 22, (15 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('CGST', recX + (50 * boxWidth / 100) + 22, long_tme_y + 27);
  doc.rect(recX + (50 * boxWidth / 100), long_tme_y + 22 + 15, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('Rate', recX + (50 * boxWidth / 100) + 2, long_tme_y + 42);
  doc.rect(recX + (50 * boxWidth / 100) + (15 * boxWidth / 200), long_tme_y + 22 + 15, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(9).font('Helvetica')
    .text('Amount', recX + (50 * boxWidth / 100) + 39, long_tme_y + 42);
  doc.rect(recX + (65 * boxWidth / 100), long_tme_y + 22, (15 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('SCGST/UTGST', recX + (65 * boxWidth / 100) + 2, long_tme_y + 27);
  doc.rect(recX + (65 * boxWidth / 100), long_tme_y + 22 + 15, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('Rate', recX + (65 * boxWidth / 100) + 2, long_tme_y + 42);
  doc.rect(recX + (65 * boxWidth / 100) + (15 * boxWidth / 200), long_tme_y + 22 + 15, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(9).font('Helvetica')
    .text('Amount', recX + (65 * boxWidth / 100) + 39, long_tme_y + 42);
  doc.rect(recX + (80 * boxWidth / 100), long_tme_y + 22, (20 * boxWidth / 100), 30).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('Total Tax Amount', recX + (80 * boxWidth / 100) + 24, long_tme_y + 25, {
      width: 50, // wrap text within 300 points
      align: 'center'
    });

  //

  doc.rect(recX, long_tme_y + 52, (40 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('23091000', recX + 5, long_tme_y + 57);

  doc.rect(recX + (40 * boxWidth / 100), long_tme_y + 52, (10 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('11,489.52', recX + (40 * boxWidth / 100) + 2, long_tme_y + 57);

  doc.rect(recX + (50 * boxWidth / 100), long_tme_y + 52, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('9%', recX + (50 * boxWidth / 100) + 12, long_tme_y + 57);

  doc.rect(recX + (115 * boxWidth / 200), long_tme_y + 52, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('1,034.05', recX + (115 * boxWidth / 200) + 4, long_tme_y + 57);

  doc.rect(recX + (65 * boxWidth / 100), long_tme_y + 52, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('9%', recX + (65 * boxWidth / 100) + 12, long_tme_y + 57);

  doc.rect(recX + (145 * boxWidth / 200), long_tme_y + 52, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(8).font('Helvetica')
    .text('1,034.05', recX + (145 * boxWidth / 200) + 4, long_tme_y + 57);

  doc.rect(recX + (80 * boxWidth / 100), long_tme_y + 52, (20 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica')
    .text('2,068.10', recX + (80 * boxWidth / 100) + 26, long_tme_y + 57);

  //

  doc.rect(recX, long_tme_y + 67, (40 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica-Bold')
    .text('Total', recX + 170, long_tme_y + 69);

  doc.rect(recX + (40 * boxWidth / 100), long_tme_y + 67, (10 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica-Bold')
    .text('11,489.67', recX + (40 * boxWidth / 100) + 2, long_tme_y + 69);

  doc.rect(recX + (50 * boxWidth / 100), long_tme_y + 67, (15 * boxWidth / 200), 15).stroke();

  doc.rect(recX + (115 * boxWidth / 200), long_tme_y + 67, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(8).font('Helvetica-Bold')
    .text('1,034.05', recX + (115 * boxWidth / 200) + 4, long_tme_y + 69);

  doc.rect(recX + (65 * boxWidth / 100), long_tme_y + 67, (15 * boxWidth / 200), 15).stroke();


  doc.rect(recX + (145 * boxWidth / 200), long_tme_y + 67, (15 * boxWidth / 200), 15).stroke();
  doc.fontSize(8).font('Helvetica-Bold')
    .text('1,034.05', recX + (145 * boxWidth / 200) + 4, long_tme_y + 69);

  doc.rect(recX + (80 * boxWidth / 100), long_tme_y + 67, (20 * boxWidth / 100), 15).stroke();
  doc.fontSize(10).font('Helvetica-Bold')
    .text('2,068.10', recX + (80 * boxWidth / 100) + 26, long_tme_y + 72);

  const newY = doc.y;


  doc.rect(recX, newY - 2, boxWidth, 135).stroke();

  doc.fontSize(8).font('Helvetica').text('Tax Amount (in words) :', boxX, newY + 2, { continued: true })
  doc.fontSize(8).font('Helvetica-Bold').text('INR Two Thousand Sixty Eight and Ten paise Only', boxX, newY + 2)

  doc.fontSize(8).font('Helvetica')
    .text("Company's Bank Details", boxX + boxWidth / 2, newY + 17)

  doc.fontSize(8).font('Helvetica')
    .text("A/c Holder's Name :", boxX + boxWidth / 2, newY + 27, { continued: true })
  doc.fontSize(8).font('Helvetica-Bold')
    .text("NUTRITIONNXT PRIVATE LIMITED", boxX + boxWidth / 2, newY + 27)

  doc.fontSize(8).font('Helvetica')
    .text("Bank Name            :", boxX + boxWidth / 2, newY + 37, { continued: true })
  doc.fontSize(8).font('Helvetica-Bold')
    .text("STATE BANK OF INDIA-5824", boxX + boxWidth / 2, newY + 37)

  doc.fontSize(8).font('Helvetica')
    .text("A/c No.                    :", boxX + boxWidth / 2, newY + 47, { continued: true })
  doc.fontSize(8).font('Helvetica-Bold')
    .text("43514325824", boxX + boxWidth / 2, newY + 47)

  doc.fontSize(8).font('Helvetica')
    .text("Branch & IFS Code :", boxX + boxWidth / 2, newY + 57, { continued: true })
  doc.fontSize(8).font('Helvetica-Bold')
    .text("KOTHAGUDA & SBIN0015916", boxX + boxWidth / 2, newY + 57)

  doc.fontSize(8).font('Helvetica')
    .text("SWIFT Code            :", boxX + boxWidth / 2, newY + 67)

  doc.rect(recX + boxWidth / 2, newY + 75, boxWidth / 2, 58).stroke();

  doc.fontSize(9).font('Helvetica-Bold')
    .text("for NUTRITIONNXT PRIVATE LIMITED", recX + boxWidth / 2 + 70, newY + 80, { align: 'left', width: 200 })

  doc.fontSize(9).font('Helvetica')
    .text("Authorised Signatory", recX + boxWidth / 2 + 150, newY + 116, { align: 'left', width: 200 })

  doc.fontSize(9).font('Helvetica')
    .text("Declaration", recX + 5, newY + 80)
  doc.moveTo(recX + 7, newY + 90)
    .lineTo(recX + 50, newY + 90)
    .stroke();

  doc.fontSize(10).font('Helvetica')
    .text("We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.", recX + 5, newY + 100, {
      align: 'left',
      width: 250
    })


  doc.end();

}

genInvoice(incomingData)