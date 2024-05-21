      const template = await emailTemplate("cancelTransaction.template.ejs", {
        transaction,
      });

      await sendEmail(user.email, `Cancel Order - ${transaction.id}`, template);
    }
