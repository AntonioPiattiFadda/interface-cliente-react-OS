import {
  Button,
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './Formulario.module.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7e6390', // Color pastel que se usará para el focus
    },
  },
});

const FormCheckout = ({ getCartTotalPrice, cart, clearCart }) => {
  const [successBuy, setSuccesBuy] = useState({ stage: 0, active: false });
  const [orderId, setOrderId] = useState(0);
  const [orderInfo, setOrderInfo] = useState({});
  const [total, setTotal] = useState(0);
  const [buyer, setBuyer] = useState({});
  const [extraDeliveryError, setExtraDeliveryError] = useState({
    cashPayError: false,
    cashPayErrorMessage: '',
    deliveryError: false,
    deliveryErrorMessage: '',
  });

  const { handleSubmit, handleChange, values, setFieldValue, errors } =
    useFormik({
      initialValues: {
        nombre: '',
        email: '',
        phone: '',
        delivery: undefined,
        deliveryDay: '',
        adress: '',
        adressNumber: null,
        neighborhood: '',
        apartment: false,
        pay: '',
        cashPayment: 0,
      },

      validationSchema: Yup.object({
        nombre: Yup.string()
          .min(6, 'El nombre debe tener al menos 6 caracteres')
          .required('El nombre es obligatorio'),
        email: Yup.string()
          .email('El correo electrónico no es válido')
          .matches(/@/, 'El correo electrónico debe contener @')
          .required('El correo electrónico es obligatorio'),
        phone: Yup.number()
          .typeError('El teléfono tiene que ser un número')
          .required('El numero de telefono es obligatorio'),
        delivery: Yup.boolean().required(),
        pay: Yup.string().required(),
        cashPayment: Yup.number(),
      }),

      onSubmit: (data) => {
        let total = getCartTotalPrice();
        let order = {
          //NOTE -  Informacion que va al dueño del local
          buyer: data,
          items: cart,
          total,
        };
        let newOrderId = 450;
        //ANCHOR - Validador manual de la info
        console.log(data.delivery);
        if (data.delivery === true && data.cashPayment === 0) {
          setExtraDeliveryError({
            deliveryError: true,
            deliveryErrorMessage:
              'Controla la informacion del envio te faltan campos',
          });
          return;
        }
        if (data.pay === 'cash' && data.cashPayment === 0) {
          setExtraDeliveryError({
            cashPayError: true,
            cashPayErrorMessage:
              'Por favor ingresa el valor con el que vas a pagar',
          });
          return;
        }

        setOrderId(newOrderId);
        setBuyer(data);
        setTotal(total);
        setOrderInfo(cart);
        setSuccesBuy({ ...successBuy, active: true });
        const getCartItemDetails = (cart) => {
          const itemDetails = cart.map(
            (item) => `${item.name} (X${item.quantity})`
          );
          return itemDetails.join(`,
          `);
        };

        const message = ` ¡Hola! Quisiera hacer el siguiente pedido a nombre de ${
          data.nombre
        }: 
        ${getCartItemDetails(cart)}. 

Retiro el dia: XXX
Quisiera que me lo envien a: XXX

Pago: ${data.pay}. 
Pago con: XXX
        
Total: ${total}.`;

        const sendWhatsAppMessage = () => {
          const whatsappLink = `https://wa.me/${3516192831}?text=${encodeURIComponent(
            message
          )}`;
          window.location.href = whatsappLink;
        };

        sendWhatsAppMessage();
      },
    });

  if (successBuy.active) {
    return (
      <div className={styles.finalInfo}>
        <Typography className={styles.title} color="grey.800">
          La compra se ha efectuado correctamente! Felicidades!
        </Typography>
        <Typography className={styles.subtitle} color="grey.800">
          Tu número de seguimiento es {orderId}
        </Typography>
        <span className={styles.deliveryInfo}>
          {' '}
          Forma de entrega: {buyer.delivery}
        </span>
        <span className={styles.deliveryInfo}>
          Entrega el día: {buyer.deliveryDay}
        </span>
        <span className={styles.deliveryInfo}>Tipo de pago: {buyer.pay}</span>
        <span className={styles.deliveryInfo}>
          Paga con: {buyer.cashPayment}
        </span>
        <span className={styles.orderList}>
          {' '}
          Tu pedido es:{' '}
          <ul className={styles.listItem}>
            {orderInfo.map((item, index) => (
              <li key={index} className={styles.listItem}>
                {item.quantity} {item.name}
              </li>
            ))}
          </ul>
        </span>
        <p className={styles.deliveryInfo}>
          {' '}
          A nombre de: <span className={styles.bold}>{buyer.nombre}</span>
        </p>
        <p className={styles.deliveryInfo}>
          Email: <span className={styles.bold}>{buyer.email}</span>
        </p>
        <span className={styles.total}> Total: ${total} </span>
        <span>La idea es que todo esto se mande por Whatsapp</span>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
        color="grey.800"
        align="center"
      >
        {successBuy.stage === 0 && 'Necesitamos algunos datos para el envio'}
        {successBuy.stage === 1 && ' ¡Ya casi terminas tu compra!'}
      </Typography>

      <form className="form-container" onSubmit={handleSubmit}>
        <ThemeProvider theme={theme}>
          <Grid
            container
            alignItems={'center'}
            justifyContent="space-evenly"
            spacing={2}
            sx={{ width: '100%', marginLeft: '0px' }}
          >
            {successBuy.stage === 0 && (
              <>
                {' '}
                <Grid item xs={12} md={7}>
                  <TextField
                    type="text"
                    label="Ingrese su nombre"
                    name="nombre"
                    onChange={(e) => {
                      setFieldValue('nombre', e.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    // value={values.nombre}
                    helperText={errors.nombre}
                    error={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <TextField
                    type="email"
                    label="Ingrese su email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    onChange={handleChange}
                    // value={values.email}
                    error={errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <TextField
                    type="text"
                    label="Ingrese su teléfono"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    onChange={handleChange}
                    // value={values.phone}
                    error={errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Button
                  sx={{
                    marginTop: '15px',
                    alignSelf: 'flex-end',
                  }}
                  variant="outlined"
                  onClick={() => {
                    if (
                      values.nombre === '' ||
                      values.email === '' ||
                      values.phone === ''
                    )
                      return;
                    setSuccesBuy({ ...successBuy, stage: 1 });
                  }}
                >
                  continuar
                </Button>
              </>
            )}

            {successBuy.stage === 1 && (
              <>
                <FormControl sx={{ m: 2, minWidth: 350 }}>
                  <InputLabel id="demo-simple-select-label">
                    Forma de entrega
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Forma de entrega"
                    onChange={handleChange}
                    error={errors.delivery}
                    helperText={errors.delivery}
                    name="delivery"
                  >
                    <MenuItem value={false}>Retiro</MenuItem>
                    <MenuItem value={true}>Envio</MenuItem>
                  </Select>
                  {errors.delivery && (
                    <p style={{ color: 'red', margin: 5 }}>{errors.delivery}</p>
                  )}
                </FormControl>
                {values.delivery === false && (
                  <>
                    <FormControl sx={{ m: 2, minWidth: 350 }}>
                      <InputLabel htmlFor="grouped-native-select">
                        ¿Qué día retiras?
                      </InputLabel>
                      <Select
                        native
                        defaultValue=""
                        id="grouped-native-select"
                        label="¿Qué día retiras?"
                        onChange={handleChange}
                        error={errors.deliveryDay}
                        helperText={errors.deliveryDay}
                        name="deliveryDay"
                      >
                        <option aria-label="None" value="" />
                        <optgroup label="Lunes">
                          <option value={1}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={2}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                        <optgroup label="Martes">
                          <option value={3}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={4}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                        <optgroup label="Miercoles">
                          <option value={5}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={6}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                        <optgroup label="Miercoles">
                          <option value={5}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={6}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                        <optgroup label="Miercoles">
                          <option value={5}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={6}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                        <optgroup label="Miercoles">
                          <option value={5}>Mañana (10:00 a 14:00 hs)</option>
                          <option value={6}>Tarde (5:00 a 18:00 hs)</option>
                        </optgroup>
                      </Select>
                    </FormControl>
                  </>
                )}
                {values.delivery && (
                  <>
                    <TextField
                      sx={{ m: 1, minWidth: 350 }}
                      label="Calle"
                      variant="outlined"
                      fullWidth
                      name="adress"
                      onChange={handleChange}
                      error={errors.adress}
                      helperText={errors.adress}
                    />
                    <TextField
                      sx={{ m: 1, minWidth: 350 }}
                      label="Número de calle"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        inputMode: 'numeric',
                      }}
                      name="adressNumber"
                      onChange={handleChange}
                      error={errors.adressNumber}
                      helperText={errors.adressNumber}
                    />
                    <TextField
                      sx={{ m: 1, minWidth: 350 }}
                      label="Barrio"
                      variant="outlined"
                      fullWidth
                      name="neighborhood"
                      onChange={handleChange}
                      error={errors.neighborhood}
                      helperText={errors.neighborhood}
                    />
                    <InputLabel htmlFor="apartment-select">
                      ¿Es un departamento?
                    </InputLabel>
                    <Select
                      sx={{ m: 2 }}
                      native
                      defaultValue=""
                      id="apartment-select"
                      label="¿Es un departamento?"
                      onChange={handleChange}
                      error={errors.apartment}
                      helperText={errors.apartment}
                      name="apartment"
                    >
                      <option value={1}>Sí</option>
                      <option value={2}>No</option>
                    </Select>

                    <TextField
                      sx={{ m: 1, minWidth: 350 }}
                      label="Ayúdanos a encontrar tu domicilio"
                      variant="outlined"
                      fullWidth
                      name="neighborhood"
                      multiline
                      rows={4}
                      onChange={handleChange}
                    />

                    {2 === 1 && (
                      <>
                        <TextField
                          sx={{ m: 1, minWidth: 350 }}
                          label="Número de departamento"
                          variant="outlined"
                          fullWidth
                        />
                      </>
                    )}
                  </>
                )}
                <FormControl sx={{ m: 2, minWidth: 350 }}>
                  <InputLabel id="demo-simple-select-label">
                    Forma de pago
                  </InputLabel>
                  <Select
                    labelId="emo-simple-select-label"
                    id="demo-simple-select"
                    name="pay"
                    label=" Forma de pago"
                    onChange={handleChange}
                    error={errors.pay}
                    helperText={errors.pay}
                  >
                    <MenuItem value={'cash'}>Efectivo</MenuItem>
                    <MenuItem value={'transfer'}>Transferencia</MenuItem>
                  </Select>
                </FormControl>
                {errors.pay ? (
                  <p style={{ color: 'red', margin: 0, marginTop: '-10px' }}>
                    {errors.pay}
                  </p>
                ) : (
                  <></>
                )}

                {values.pay === 'cash' && (
                  <>
                    <TextField
                      name="cashPayment"
                      fullWidth
                      onChange={handleChange}
                      margin="normal"
                      label="¿Con cuánto pagás?"
                      id="outlined-start-adornment"
                      sx={{ width: '25ch' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                    {extraDeliveryError.cashPayError && (
                      <span>{extraDeliveryError.cashPayErrorMessage}</span>
                    )}
                  </>
                )}
                {values.pay === 'transfer' && (
                  <span
                    style={{
                      display: 'block',
                      backgroundColor: '#f3d2c1',
                      color: '#7e6390',
                      padding: '10px',
                      borderRadius: '8px',
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Te enviaremos los datos de la transferencia por WhatsApp
                  </span>
                )}
              </>
            )}
          </Grid>
          {successBuy.stage === 1 && (
            <>
              <Button
                sx={{
                  marginTop: '15px',
                  alignSelf: 'flex-end',
                }}
                type="submit"
                variant="contained"
              >
                Enviar WhatsApp
              </Button>
            </>
          )}
        </ThemeProvider>
      </form>
      <span style={{ height: '55px' }}></span>
    </div>
  );
};

export default FormCheckout;
